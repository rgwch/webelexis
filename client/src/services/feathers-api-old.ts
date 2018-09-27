/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import * as io from 'socket.io-client';
import * as feathers from '@feathersjs/client';

interface Service {
  get(index: string, params?: any): any
  find(params): any
  put(index, obj): any
  path: string
}

function dataType(service:Service){
  return service.path
}
const baseUrl = 'http://localhost:3030';
const socket = io.connect(baseUrl);

const client = feathers()
  .configure(feathers.socketio(socket));

const termin: Service = client.service('termin')
const kontakt: Service = client.service('kontakt')
const patient: Service = client.service('patient')
const artikel: Service = client.service('article')
const konsultation: Service = client.service('konsultation')


export { Service, dataType, client, termin, kontakt, patient, artikel, konsultation };
