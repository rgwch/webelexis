import { FHIR_Resource } from './../model/fhir';
import { IFhirAdapter } from "fhir/fhir-api";
import { FHIR_Patient } from "fhir/model/fhir";
import { PatientType } from "models/patient";
import { Helper } from "./helper";
import { ElexisType } from "models/elexistype";
import { IQueryResult } from 'services/datasource';

export class PatientAdapter implements IFhirAdapter {
  public toElexisObject(fhirpat: FHIR_Patient): ElexisType {
    const name = Helper.getName(fhirpat.name);
    const addr = Helper.getAddress(fhirpat.address, "home");
    const comm = Helper.getComm(fhirpat.telecom, "home");
    const gender = Helper.getGender(fhirpat.gender)
    const ret: PatientType = {
      id: fhirpat.id,
      Bezeichnung1: name.Bezeichnung1,
      Bezeichnung2: name.Bezeichnung2,
      Bezeichnung3: name.Bezeichnung3,
      geburtsdatum: Helper.getDate(fhirpat.gender),
      geschlecht: gender,
      strasse: addr.street,
      plz: addr.zip,
      ort: addr.place,
      telefon1: comm.phone,
      email: comm.mail
    };
    return ret
  }

  public toFhirObject(obj: ElexisType): FHIR_Resource {
    const ret: FHIR_Patient={

    }
    return ret
  }

  public toQueryResult(bundle): IQueryResult {
    return null
  }
  public path = "Patient"
}
