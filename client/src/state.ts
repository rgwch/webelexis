import {ElexisType} from './models/elexistype'
export interface State{
  user: string,
  termin: ElexisType,
  patient: ElexisType,
  document: ElexisType
  date: Date
}

export const webelexisState:State={
  user: "Gerry",
  termin: undefined,
  patient: undefined,
  document: {},
  date: new Date()
}

