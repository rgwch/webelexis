import { writable, type Writable } from 'svelte/store'
import type { PatientType } from '../models/patient-model';


export const currentPatient: Writable<PatientType> = writable()
