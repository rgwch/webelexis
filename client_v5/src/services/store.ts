import { writable, type Writable } from 'svelte/store'
import type { PatientType } from '../models/patient-model';
import type { RezeptType } from '../models/prescription-model'
import type { KontaktType } from '../models/kontakt-model'


export const currentPatient: Writable<PatientType> = writable()
export const currentRezept: Writable<RezeptType> = writable()
export const currentUser: Writable<KontaktType> = writable()
