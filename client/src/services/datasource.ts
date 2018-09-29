/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { create } from "domain";
import { publish, subscribeOn } from "rxjs/operators";
import { emit, on } from "cluster";

export interface DataService {
  get(index: string, params?: any): any
  find(params): any
  create(data): any
  update(index, obj): any
  remove(index): any
  emit(topic,msg)
  on(topic,fun)
  path: string
}

export interface IDataSource {
  getService(name: string): DataService
  dataType(service: DataService): string
}

export class DataSource implements IDataSource {
  getService(name: string): DataService {
    throw new Error("No DataSource is configured");
  }

  dataType(service: DataService): string {
    throw new Error("No DataSource is configured");
  }

}
