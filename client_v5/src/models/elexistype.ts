/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import type { StickerType } from './stickers-model'
/**
 * Base model for all types transported from and to the elexis database
 */
export interface ElexisType {
  type?: string
  id?: UUID
  stickers?: Array<string>
}

export type UUID = string // UUIDv4 (36) or ElexisID (25)

export type DATE = string // YYYYMMDD
