import {IDataSource,DataService} from './datasource'
import * as io from 'socket.io-client';
import * as feathers from '@feathersjs/client';
import env from '../environment'

export class FeathersDS implements IDataSource{
  private client
  private socket

  constructor(){
    const socket = io.connect(env.baseURL);

    this.client = feathers()
    .configure(feathers.socketio(socket));

  }

  getService(name: string): DataService{
    return this.client.service(name)
  }

  dataType(service:DataService){
    return service.path
  }
}
