import { StickerType } from "./stickers.model";

/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Base model for all types transported from and to the elexis database
 */
export interface ElexisType {
  type?: string
  id?: string
  stickers?: string[]
}

export type UUID = string

export type DATE = string
