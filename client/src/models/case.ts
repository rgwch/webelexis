import { PatientType } from './patient';
import { KontaktType } from './kontakt';
export interface CaseType{
  guarantor: KontaktType|string,
  patient: PatientType|string,
  startDate: Date,
  endDate: Date,
  id: string
}
