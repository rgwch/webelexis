/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import * as feathers from "@feathersjs/client";
import { autoinject, LogManager } from "aurelia-framework";
import * as io from "socket.io-client";
import env from "../environment";
import { IDataService, IDataSource } from "./dataservice";
const log = LogManager.getLogger("feathers-api");
import { IUser } from './../models/user-model';
import { IKontakt } from './../models/kontakt-model';


/**
 * A DataSource implementation based on FeathersJS
 * with SocketIO-Transport.
 */
@autoinject
export class FeathersDS implements IDataSource {
  private client;
  
  constructor() {
    const socket = io.connect(env.baseURL);

    this.client = feathers()
    this.client.configure(feathers.socketio(io))
      .configure(feathers.socketio(socket))
      .configure(feathers.authentication({storageKey: 'auth'}));
  }

  public getService(name: string): IDataService {
    return this.client.service(name);
  }

  public dataType(service: IDataService) {
    return service.path;
  }

  /**
   * Perform Authentication. If username and password are given:
   * use these credentials. If not: Try to login with locally stored JWT Token
   * (which is valid for a limited time, so a simple browser reload won't log out
   * the user, but extended inactivity will.)
   * @param username optional e-mail
   * @param password optional password
   * @returns the logged in 'user' object with all properties except the password.
   * or undefined if it could not log in.
   */
  public async login(username?: string, password?: string): Promise<IUser> {
    try {
      let jwt;
      if (username && password) {
        jwt = await this.client.authenticate({
          id: username,
          password,
          strategy: "local"
        });
      } else {
        jwt = await this.client.authenticate();
      }
      const verified = await this.client.passport.verifyJWT(jwt.accessToken);
      const user = await this.client.service("user").get(verified.userId);
      return user;
    } catch (err) {
      log.error("Error while authenticating " + err);
      return undefined;
    }
  }

  /**
   * Invalidates the JWT token
   */
  public async logout() {
    return this.client.logout();
  }

  public metadata() {
    log.info("getting metadata from " + env.baseURL);
    return fetch(env.baseURL + "metadata")
      .then(response => {
        return response.json();
      })
      .then(json => {
        env["metadata"] = json;
        return json;
      })
      .catch(err => {
        log.error("can't fetch metadata: " + err);
        // alert(this.i18n.tr("errmsg.connect"));
        return env.metadata
      });
  }
}
