import { IUser } from '../models/user-manager';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/
import { IDataSource, IDataService } from './dataservice';
import { autoinject } from 'aurelia-framework';
import * as feathers from '@feathersjs/feathers'
import * as socketio from '@feathersjs/socketio-client'
import * as io from 'socket.io-client'
import * as auth from '@feathersjs/authentication-client'
import env from 'environment'


/**
 * A DataSource implementation based on FeathersJS
 * with SocketIO-Transport.
 */
@autoinject
export class FeathersDS implements IDataSource {
  private client

  constructor() {
    const socket = io(env.baseURL);
    this.client = feathers()
    this.client.configure(socketio(socket))
    this.client.configure(auth.default({}))
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

  public async login(username?, password?) {
    let user
    if (username && password) {
      user = await this.client.authenticate({
        strategy: 'local',
        id: username,
        password: password
      })
    } else {
      user = await this.client.reAuthenticate()
    }
    return user.user
  }

  public async checkLogin(): Promise<IUser> {
    const jwt = this.client.authenticate();
    const verified = await this.client.passport.verifyJWT(jwt.accessToken);
    const user = await this.client.service("user").get(verified.userId);
    return user;
  }

  /**
   * Invalidates the JWT token
   */
  public async logout() {
    return this.client.logout();
  }

  public metadata() {
    //log.info("getting metadata from " + env.baseURL);
    return fetch(env.baseURL + "metadata")
      .then(response => {
        return response.json();
      })
      .then(json => {
        env["metadata"] = json;
        return json;
      })
      .catch(err => {
        //log.error("can't fetch metadata: " + err);
        // alert(this.i18n.tr("errmsg.connect"));
        return env.metadata
      });
  }
}
