import { writable, type Writable } from 'svelte/store'
import type { PatientType } from '../models/patient-model';
import type { RezeptType } from '../models/prescription-model'
import type { KontaktType } from '../models/kontakt-model'
import type { UserType } from '../models/user-model';



export const currentPatient: Writable<PatientType> = writable()
export const currentRezept: Writable<RezeptType> = writable()
export const currentActor: Writable<KontaktType> = writable()
export const currentUser: Writable<UserType> = writable()


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
