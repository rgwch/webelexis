/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import cfg from '../services/properties'
import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import auth from '@feathersjs/authentication-client';
import type { ServiceMethods, Params, Id, NullableId, Paginated } from "@feathersjs/feathers";

const socket = io(cfg.server)
const app = feathers()
app.configure(feathers.socketio(socket))
app.configure(auth({ storage: window.localStorage }))


export interface IService<T> {
  /**
      * Retrieve all resources from this service.
      *
      * @param params - Service call parameters {@link Params}
      * @see {@link https://docs.feathersjs.com/api/services.html#find-params|Feathers API Documentation: .find(params)}
      */
  find(params?: Params): Promise<T | T[] | Paginated<T>>;

  /**
   * Retrieve a single resource matching the given ID.
   *
   * @param id - ID of the resource to locate
   * @param params - Service call parameters {@link Params}
   * @see {@link https://docs.feathersjs.com/api/services.html#get-id-params|Feathers API Documentation: .get(id, params)}
   */
  get(id: Id, params?: Params): Promise<T>;

  /**
   * Create a new resource for this service.
   *
   * @param data - Data to insert into this service.
   * @param params - Service call parameters {@link Params}
   * @see {@link https://docs.feathersjs.com/api/services.html#create-data-params|Feathers API Documentation: .create(data, params)}
   */
  create(data: Partial<T> | Partial<T>[], params?: Params): Promise<T | T[]>;

  /**
   * Replace any resources matching the given ID with the given data.
   *
   * @param id - ID of the resource to be updated
   * @param data - Data to be put in place of the current resource.
   * @param params - Service call parameters {@link Params}
   * @see {@link https://docs.feathersjs.com/api/services.html#update-id-data-params|Feathers API Documentation: .update(id, data, params)}
   */
  update(id: NullableId, data: T, params?: Params): Promise<T | T[]>;

  /**
   * Merge any resources matching the given ID with the given data.
   *
   * @param id - ID of the resource to be patched
   * @param data - Data to merge with the current resource.
   * @param params - Service call parameters {@link Params}
   * @see {@link https://docs.feathersjs.com/api/services.html#patch-id-data-params|Feathers API Documentation: .patch(id, data, params)}
   */
  patch(id: NullableId, data: Partial<T>, params?: Params): Promise<T | T[]>;

  /**
   * Remove resources matching the given ID from the this service.
   *
   * @param id - ID of the resource to be removed
   * @param params - Service call parameters {@link Params}
   * @see {@link https://docs.feathersjs.com/api/services.html#remove-id-params|Feathers API Documentation: .remove(id, params)}
   */
  remove(id: NullableId, params?: Params): Promise<T | T[]>;
}

export type ServiceType = "admin" | "billable" | "billing" | "bills" | "blob" | "briefe" | "diagnose" | "fall" | "invoice" |
  "konsultation" | "meta-article" | "kontakt" | "patient" | "payments" | "prescriptions" | "rezepte" | "stickers" | "termin" |
  "user" | "utility"
export const getService = (name: ServiceType) => app.service(name)


export const authorize = async (username, password): Promise<any> => {
  let jwt
  if (username && password) {
    jwt = await app.authenticate({
      id: username, password,
      strategy: "local"
    })
  } else {
    jwt = await app.authenticate()
  }
  const { user } = await app.get('authentication')
  return user
}

export const deAuthorize = () => {
  app.logout()
}
