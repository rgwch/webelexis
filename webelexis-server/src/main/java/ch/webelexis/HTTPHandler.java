/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis;

import ch.rgw.tools.VersionedResource;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.MultiMap;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import io.vertx.core.net.SocketAddress;
import io.vertx.core.spi.PumpFactory;
import io.vertx.core.streams.Pump;
import io.vertx.core.streams.ReadStream;
import io.vertx.core.streams.impl.PumpFactoryImpl;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;
import java.util.TimeZone;
import java.util.UUID;
import java.util.jar.Attributes;
import java.util.jar.Manifest;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * The handler for HTTP requests to the Webelexis server. If root (/) or
 * /index.html is requested, a Session is created, and a custom made File is
 * returned, which contains the SessionID, a unique STATE variable and the
 * Google ClientID of the server (if there is such a ClientID configured). Paths
 * are interpreted relative to the webroot of the Webelexis verticle. Requests
 * to travel the directory tree upwards, are rejected.
 */

public class HTTPHandler implements Handler<HttpServerRequest> {
  final JsonObject cfg;
  final EventBus eb;
  Logger log = Logger.getLogger("HTTPHandler");
  // Date: Mon, 27 Apr 2015 16:51:46 GMT
  final SimpleDateFormat df = new SimpleDateFormat("E, dd MM yyyy HH:mm:ss z");

  HTTPHandler(JsonObject cfg, EventBus eb) {
    this.cfg = cfg;
    this.eb = eb;
    File cwd = new File(".");
    log.log(Level.FINE, "cwd: " + cwd.getAbsolutePath());
    df.setTimeZone(TimeZone.getTimeZone("UTC"));

  }

  @Override
  public void handle(HttpServerRequest req) {
    Date date = new Date();
    req.response().putHeader("Date", df.format(date));
    req.response().putHeader("Server", "Webelexis");
    if (req.path().equals("/") || req.path().equals("/index.html")) {
      // If the client requests the root file: create a new session.
      String rnd = UUID.randomUUID().toString();
      SocketAddress remote = req.remoteAddress();
      String IP = "0.0.0.0";
      if (remote != null) {
        IP = remote.toString();
      }
      JsonObject sessionParams = new JsonObject().put("clientID", cfg.getString("googleID"))
        .put("state", rnd).put("remoteAddress", IP);
      eb.send("ch.webelexis.session.create", sessionParams, new SessionHandler(req, rnd));
    } else if (req.path().contains("..")) {
      // if the client tries to travel up the file system: forbidden
      req.response().setStatusCode(403);
      req.response().end();
    } else {
      // any other resource
      anyOtherResource(req);
    }
  }

  /**
   * Load a resource as requested in the HTTPServerRequest.
   * If the resource path starts with "/custom/" search in the customRoot first. If not found, search in
   * webroot.
   * If the path starts with any other prefix, search directly from webroot
   * @param req The HttpServerRequest
   */
  private void anyOtherResource(HttpServerRequest req) {
    try {
      RscObject rsc;
      String addrPath = req.path();
      if (addrPath.startsWith("/custom/")) {
        rsc = getResource(cfg.getString("customRoot", ""), addrPath.substring(8));
        if (rsc.stream == null) {
          rsc = getResource(cfg.getString("webroot"), req.path());
        }
      } else {
        rsc = getResource(cfg.getString("webroot"), req.path());
      }
      if (rsc.stream == null) {
        String ans = "Not found";
        req.response().putHeader("Content-Length", Integer.toString(ans.length()));
        req.response().write(ans);
        req.response().setStatusCode(404); // not found
        req.response().setStatusMessage("Not found");
        req.response().end();
      } else {
      /*
       * If the client asks for an existing file: define cache control: (arbitrarily). let
       * css and js be valid for 24 hours, image files for 10 days. But both can
       * live longer, if the client knows and uses the "if-modified-since"-
       * Header on expired files.
       */

        Date lm = rsc.lastModified;
        String reqDat = req.headers().get("if-modified-since");
        boolean noSend = false;
        if (reqDat != null) {
          try {
            Date reqDate = df.parse(reqDat);
            if (!reqDate.before(lm)) { // after or equal
              noSend = true;
            }
          } catch (ParseException e) {
            log.warning("could not parse reqDat " + reqDat);
          }
        }
        req.response().putHeader("Last-Modified", df.format(lm));
        if (req.path().endsWith(".css")) {
          req.response().putHeader("Cache-Control", "max-age=864000");
          req.response().putHeader("content-type", "text/css; charset=UTF-8");
        } else if (req.path().endsWith(".js")) {
          req.response().putHeader("Content-Type", "application/javascript; charset=utf-8");
          req.response().putHeader("Cache-Control", "max-age=864000");
        } else if (req.path().endsWith(".png") || req.path().endsWith(".jpg")) {
          req.response().putHeader("Cache-Control", "public, max-age=864000");
        }
        if (noSend) {
          req.response().setStatusCode(304);
          // req.response().setStatusMessage("not modified");
          req.response().end();
        } else {
          req.response().setChunked(true);
          BufferedInputStream bis = new BufferedInputStream(rsc.stream);
          byte[] buffer = new byte[4 * 4096];
          int i;
          while ((i = bis.read(buffer)) == buffer.length) {
            req.response().write(Buffer.buffer(buffer));
          }
          req.response().end(Buffer.buffer(buffer).slice(0, i));
        }
      }
    } catch (Exception ex) {
      req.response().setStatusCode(500);
    }
  }

  /**
   * Called after a new session is created (the client asked for "/" or "/index.html")
   *
   * @author gerry
   */
  class SessionHandler implements Handler<AsyncResult<Message<JsonObject>>> {
    final HttpServerRequest req;
    final String rnd;
    final MultiMap headers;
    final SocketAddress remoteAdress;

    SessionHandler(HttpServerRequest req, String rnd) {
      this.req = req;
      this.rnd = rnd;
      headers = req.headers();
      remoteAdress = req.remoteAddress();
    }

    @Override
    public void handle(AsyncResult<Message<JsonObject>> msg) {
      if (msg.succeeded()) {
        Scanner scanner = null;
        try {
          //File in = new File(cfg.getString("webroot"), "index.html");
          //Date lm = new Date(in.lastModified());
          RscObject index = getResource(cfg.getString("webroot"), "/index.html");
          Date lm = index.lastModified;
          req.response().putHeader("Last-Modified", df.format(lm));
          String cid = cfg.getString("googleID");
          if (cid == null) {
            cid = "x-undefined";
          }

          scanner = new Scanner(index.stream, "UTF-8");
          String modified = "";
          JsonObject body = msg.result().body();
          modified = scanner.useDelimiter("\\A").next().replaceAll("GUID",
            body.getString("sessionID")).replaceAll("GOOGLE_CLIENT_ID", cid).replaceAll(
            "GOOGLE_STATE", rnd);
          req.response().putHeader("Content-Length", Long.toString(modified.length()));
          req.response().write(modified);
        } catch (ParseException e) {
          req.response().setStatusCode(500);
        } finally {
          if (scanner != null) {
            scanner.close();
            req.response().end();
          }
        }

      } else {
        String ans = "Internal Server Error";
        req.response().putHeader("Content-Length", Integer.toString(ans.length()));
        req.response().write(ans);
        req.response().setStatusCode(500);
        req.response().end();
      }
    }
  }

  /**
   * Find and load a file either from the file system, or from the .jar of the application
   *
   * @param root parent directory for the search
   * @param name pathname relative to root
   * @return an Object containing a Stream and some informations on the file
   * @throws ParseException
   */
  RscObject getResource(String root, String name) throws ParseException {
    String className = getClass().getSimpleName() + ".class";
    String classPath = getClass().getResource(className).toString();
    String timestamp = null;
    log.finest(classPath);
    try {
      if (!classPath.startsWith("jar")) {
        // Class not from JAR
        File file = new File(root, name);
        InputStream is = new FileInputStream(file);
        return new RscObject(is, false, file.lastModified());
      }
      String manifestPath = classPath.substring(0, classPath.lastIndexOf("!") + 1) +
        "/META-INF/MANIFEST.MF";
      log.finest(manifestPath);
      Manifest manifest = new Manifest(new URL(manifestPath).openStream());
      Attributes attr = manifest.getMainAttributes();
      timestamp = attr.getValue("timestamp");
    } catch (IOException e) {
      e.printStackTrace();
      return new RscObject(null, false, 0L);
    }
    Date dat = df.parse(timestamp);
    log.fine(dat.toString());
    String resource = "/" + root + name;
    log.finest(resource);
    URL rsr = getClass().getResource(resource);
    log.finest(rsr == null ? "resource is null" : rsr.toString());
    return new RscObject(getClass().getResourceAsStream(resource), true, dat.getTime());
  }

  class RscObject {
    RscObject(InputStream is, boolean inJar, long millis) {
      this.inJar = inJar;
      this.stream = is;
      this.lastModified = new Date(millis);
    }

    InputStream stream;
    boolean inJar;
    Date lastModified;
  }
}
