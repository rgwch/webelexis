/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { ElexisType, UUID } from './elexistype';
import { autoinject } from "aurelia-framework";
import { DataService } from '../services/datasource';
import { ObjectManager } from './object-manager';
import { KontaktType } from './kontakt';

import global from '../user/global'
import * as LRU from 'lru-cache'



/**
 * A Webelexis User (which is deliberately not an Elexis-User, but can be linked
 * to an Elexis-User and/or an Elexis-Kontakt)
 * A Webelexis user has an email (which has to be unique) and a set of roles. All other
 * properties are optional.
 */
export interface UserType extends ElexisType {
  kontakt_id?: UUID,
  _Kontakt?: KontaktType,
  _Mandator?: KontaktType,
  _Mandators?: string,
  is_active?: string,
  is_administrator?: string,
  extjson?: any,
  allow_external?: string,
  roles: string[]
}

@autoinject
export class UserManager extends ObjectManager {
  private kontaktService: DataService
  private adminService: DataService
  private cache
  constructor() {
    super('user')
    this.kontaktService = this.dataSource.getService('kontakt')
    this.adminService = this.dataSource.getService('admin')
    this.cache = new LRU(100)
  }

  /**
   * Check if a user has a given role
   * note: usually, you'd rather use hasACE()
   * @param usr 
   * @param role 
   */
  public hasRole(usr: UserType, role: string): boolean {
    if (role == global.roles.guest) {
      return true
    } else if (usr && usr.roles.indexOf(global.roles.admin) != -1) {
      return true
    } else if (usr) {
      return (usr.roles.indexOf(role) != -1)
    } else {
      return false
    }
  }

  /**
   * Check if a user has a given ACE
   * @param usr 
   * @param acename 
   */
  public async hasACE(usr: UserType, acename: string): Promise<boolean> {
    const key = "ace:" + (usr ? usr.id : "guest") + "." + acename
    let r = this.cache.get(key)
    if (r) {
      return r
    } else {
      r = await this.adminService.get("can:" + acename)
      this.cache.set(key, r)
      return r
    }
  }

  /**
   * Retrieve the Elexis-Kontakt linked to a user (if any)
   * @param usr 
   * @returns a Promise resolving on the Kontakt or rejecting if no such Kontakt exists
   */
  public async getElexisKontakt(usr: UserType): Promise<KontaktType> {
    if (usr._Kontakt) {
      return usr._Kontakt
    } else if (usr.kontakt_id) {
      usr._Kontakt = await this.kontaktService.get(usr.kontakt_id)
      return usr._Kontakt
    } else {
      return Promise.reject()
    }
  }

  /**
   * Retrieve the associated Mandator for a User
   * @param user
   * @returns a Promise resolving to a KontaktType representing the responsible Mandator (which might be the User teitselves) 
   */
  public async getActiveMandatorFor(user: UserType): Promise<KontaktType> {
    if (user._Mandator) {
      return user._Mandator
    }
    const k = await this.getElexisKontakt(user)
    if (k.extjson && k.extjson.Mandant) {
      const m0 = k.extjson.Mandant.split(",")[0]
      const ml = await this.kontaktService.find({ query: { bezeichnung3: m0 } })
      user._Mandator = ml.data[0]
    } else {
      user._Mandator = user._Kontakt
    }
    return user._Mandator
  }

  public async getData(user: UserType, datatype: "KSK|EAN|NIF|Kanton|TarmedSpezialität") {
    const m = await this.getActiveMandatorFor(user)
    return m.extjson[datatype]
  }
}


