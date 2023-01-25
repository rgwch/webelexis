/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2023 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { writable, type Writable } from 'svelte/store'
import type { PatientType } from '../models/patient-model';
import type { RezeptType } from '../models/prescription-model'
import type { KontaktType } from '../models/kontakt-model'
import type { UserType } from '../models/user-model';
import type { CaseType } from '../models/case-model';
import { EncounterModel, type EncounterType } from '../models/encounter-model';
import { ObjectManager } from '../models/object-manager';



export const currentPatient: Writable<PatientType> = writable()
export const currentRezept: Writable<RezeptType> = writable()
export const currentActor: Writable<KontaktType> = writable()
export const currentUser: Writable<UserType> = writable()
export const currentCase: Writable<CaseType> = writable()
export const currentEncounter: Writable<EncounterType> = writable()

export const agendaResource = writable<string>()
export const agendaDate = writable<Date>()
export const agendaResources = writable<Array<string>>()

const cm = new ObjectManager("fall")
const em = new ObjectManager("konsultation")

currentPatient.subscribe(async p => {
  if (p) {
    const encs: query_result = await em.fetchForPatient(p.id)
    if (encs.total > 0) {
      const enc: EncounterModel = new EncounterModel(encs[0])
      const c = await enc.getCase()
      currentEncounter.set(encs[0])
      currentCase.set(c)
    }
  }
})

type msgfunc = (event: any) => void

class MessageBroker {
  private subscribers = new Map<string, Array<msgfunc>>()

  public subscribe(messageId: string, func: msgfunc) {
    const funcs = this.subscribers.get(messageId) || []
    funcs.push(func)
    this.subscribers.set(messageId, funcs)
  }
  public publish(messageId: string, event: any) {
    const funcs = this.subscribers.get(messageId) || []
    funcs.forEach(func => {
      func(event)
    });
  }
  public unsubscribe(messageId: string, func: msgfunc) {
    const funcs = this.subscribers.get(messageId) || []
    const idx = funcs.findIndex(f => f == func)
    if (idx > -1) {
      funcs.splice(idx, 1)
      this.subscribers.set(messageId, funcs)
    }
  }
}

export const messageBroker = new MessageBroker()
