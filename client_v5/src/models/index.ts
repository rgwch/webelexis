import { BillingsManager } from "./billings-model"
import { CaseManager } from "./case-model"
import { DiagnoseManager } from "./diagnose-model"
import { EncounterManager } from "./encounter-model"
import { KontaktManager } from "./kontakt-model"
import { StickerManager } from "./stickers-model"
import { TerminManager } from "./termine-model"
import {UserManager} from './user-model'

export const caseManager = new CaseManager()
export const billingsManager = new BillingsManager()
export const kontaktManager = new KontaktManager()
export const encounterManager = new EncounterManager()
export const diagnoseManager = new DiagnoseManager()
export const stickerManager = new StickerManager()
export const terminManager = new TerminManager()
export const userManager = new UserManager()