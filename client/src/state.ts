/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/
import { User } from './models/user';
import {ElexisType} from './models/elexistype'
export interface State{
  user: User,
  termin: ElexisType,
  patient: ElexisType,
  document: ElexisType
  date: Date
}

export const webelexisState:State={
  user: undefined,
  termin: undefined,
  patient: undefined,
  document: {},
  date: new Date()
}

