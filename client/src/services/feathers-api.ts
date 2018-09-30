/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { IDataSource, DataService } from './datasource'
import * as io from 'socket.io-client';
import * as feathers from '@feathersjs/client';
import * as auth from '@feathersjs/authentication-client'
import env from '../environment'

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

  async login(username: string, password: string) {

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
  logout() {
    return this.client.logout()
  }
}
