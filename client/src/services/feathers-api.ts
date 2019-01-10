/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2019 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import * as auth from "@feathersjs/authentication-client";
import * as feathers from "@feathersjs/client";
import { autoinject,LogManager } from "aurelia-framework";
import { UserType } from "models/user";
import * as io from "socket.io-client";
import env from "../environment";
import { DataService, IDataSource } from "./datasource";
const log=LogManager.getLogger("feathers-api")

/**
 * A DataSource implementation based on FeathersJS
 * with SocketIO-Transport.
 */
@autoinject
export class FeathersDS implements IDataSource {
  private client;
  private socket;
  private authenticator;

  constructor() {
    const socket = io.connect(env.baseURL);

    this.client = feathers()
      .configure(feathers.socketio(socket))
      .configure(
        auth({
          storage: window.localStorage
        })
      );
  }

  public getService(name: string): DataService {
    return this.client.service(name);
  }

  public dataType(service: DataService) {
    return service.path;
  }

  /**
   * Perform Authentication. If username and password are given:
   * use these credentials. If not: Try to login with locally stored JWT Token
   * (which is valid for a limited time, so a simple browser reload won't log out
   * the user, but extended inactivity will.)
   * @param username optional e-mail
   * @param password optional password
   * @returns the logged in 'usr' object with all properties except the password.
   * or undefined if it could not log in.
   */
  public async login(username?: string, password?: string): Promise<UserType> {
    try {
      let jwt;
      if (username && password) {
        jwt = await this.client.authenticate({
          email: username,
          password,
          strategy: "local"
        });
      } else {
        jwt = await this.client.authenticate();
      }
      const verified = await this.client.passport.verifyJWT(jwt.accessToken);
      const user = await this.client.service("usr").get(verified.userId);
      return user;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  /**
   * Invalidates the JWT token
   */
  public async logout() {
    return this.client.logout();
  }

  public async metadata(){
    log.info("getting metadata from " + env.baseURL);
    return fetch(env.baseURL + "metadata")
      .then(response => {
        return response.json();
      })
      .then(json => {
        env["metadata"] = json;
      })
      .catch(err => {
        log.error("can't fetch metadata: " + err);
        // alert(this.i18n.tr("errmsg.connect"));
      });
  }
}
