/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

export type UUID = string           // UUIDV4 (36) or ElexisID (25)
export type ELEXISDATE = string     // YYYYMMDD
export type ELEXISDATETIME = string // YYYYMMDDHHMM

 /**
 * Base model for all types transported from and to the elexis database
 */
export interface IElexisType {
  type?: string
  id?: UUID
  stickers?: string[]
}

