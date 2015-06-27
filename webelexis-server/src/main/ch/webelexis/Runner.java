package ch.webelexis;

import io.vertx.core.Vertx;

/**
 * Created by gerry on 27.06.15.
 */
public class Runner {
  public static void main(String[] args){
    Vertx vertx= Vertx.vertx();
    vertx.deployVerticle("ch.webelexis.CoreVerticle");
  }
}
