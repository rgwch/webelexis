import { FHIR_Resource } from './../model/fhir';
import { IFhirAdapter } from "fhir/fhir-api";
import { FHIR_Patient } from "fhir/model/fhir";
import { PatientType } from "models/patient";
import { Helper } from "./helper";
import { ElexisType } from "models/elexistype";
import { IQueryResult } from 'services/datasource';
import { BaseAdapter } from './base-adapter';

export class PatientAdapter extends BaseAdapter {
  public toElexisObject(fhirpat: FHIR_Patient): ElexisType {
    const name = super.getName(fhirpat.name);
    const addr = super.getAddress(fhirpat.address, "home");
    const comm = super.getComm(fhirpat.telecom, "home");
    const gender = super.getGender(fhirpat.gender)
    const ret: PatientType = {
      id: fhirpat.id,
      Bezeichnung1: name.Bezeichnung1,
      Bezeichnung2: name.Bezeichnung2,
      Bezeichnung3: name.Bezeichnung3,
      geburtsdatum: super.getDate(fhirpat.gender),
      geschlecht: gender,
      strasse: addr.street,
      plz: addr.zip,
      ort: addr.place,
      telefon1: comm.phone,
      email: comm.mail,
      type: "patient"
    };
    return ret
  }

  public toFhirObject(obj: PatientType): FHIR_Resource {
    const base: FHIR_Resource = super.toFhirObject(obj)
    const ret: FHIR_Patient = Object.assign(base, {
      active: true,
      name: super.makeName(obj.Titel, obj.TitelSuffix, obj.Bezeichnung2, obj.Bezeichnung1),

    })
    return ret
  }

  public toQueryResult(bundle): IQueryResult {
    return null
  }
  public path = "Patient"
}
