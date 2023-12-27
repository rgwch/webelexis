import { BriefManager } from './briefe-model';
import { BillingsManager } from "./billings-model"
import { CaseManager } from "./case-model"
export const caseManager = new CaseManager()
import { DiagnoseManager } from "./diagnose-model"
import { EncounterManager } from "./encounter-model"
import { KontaktManager } from "./kontakt-model"
import { StickerManager } from "./stickers-model"
import { TerminManager } from "./termine-model"
import { UserManager } from './user-model'
import { PrescriptionManager } from "./prescription-model"
import { DocumentManager } from './document-model'
import { FindingsManager } from './findings-model';
import { LabresultManager } from './labresult-model';
import { AUFManager } from './auf-model';
import { CashManager } from './cash.model';

export const billingsManager = new BillingsManager()
export const kontaktManager = new KontaktManager()
export const encounterManager = new EncounterManager()
export const diagnoseManager = new DiagnoseManager()
export const stickerManager = new StickerManager()
export const terminManager = new TerminManager()
export const userManager = new UserManager()
export const prescriptionManager = new PrescriptionManager()
export const briefManager = new BriefManager()
export const documentManager = new DocumentManager()
export const findingsManager = new FindingsManager()
export const labresultManager = new LabresultManager()
export const aufManager = new AUFManager()
export const cashManager = new CashManager()