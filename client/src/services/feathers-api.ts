/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { IDataSource, DataService } from './datasource'
import * as io from 'socket.io-client';
import * as feathers from '@feathersjs/client';
import * as auth from '@feathersjs/authentication-client'
import env from '../environment'
import { autoinject } from 'aurelia-framework';

/**
 * A DataSource implementation based on FeathersJS
 * with SocketIO-Transport.
 */
@autoinject
export class FeathersDS implements IDataSource {
  private client
  private socket
  private authenticator

  constructor() {
    const socket = io.connect(env.baseURL);

    this.client = feathers()
      .configure(feathers.socketio(socket))
      .configure(auth({
        storage: window.localStorage
      }))
  }

  getService(name: string): DataService {
    return this.client.service(name)
  }

  dataType(service: DataService) {
    return service.path
  }

  /**
   * Perform Authentication. If username and password are given:
   * use these credentials. If not: Try to login with locally stored JWT Token
   * (which is valid for a limited time, so a simple browser reload won't log out
   * the user, but extended inactivity will.)
   * @param username optional e-mail
   * @param password optional password
   * @returns the logged in 'usr' object with all properties except the password
   * @throws authentication errors
   */
  async login(username?: string, password?: string) {

    try {
      let jwt
      if (username && password) {
        jwt = await this.client.authenticate({
          strategy: "local",
          email: username,
          password: password
        })
      } else {
        jwt = await this.client.authenticate()
      }
      const verified = await this.client.passport.verifyJWT(jwt.accessToken)
      const user = await this.client.service('usr').get(verified.userId)
      return user
    } catch (err) {
      console.log(err)
      throw (err)
    }
  }
  
  /**
   * Invalidates the JWT token
   */
  logout() {
    return this.client.logout()
  }
}
