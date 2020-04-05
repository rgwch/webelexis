import { FHIR_Resource } from "../model/fhir";
import { IFhirAdapter } from "fhir/fhir-api";
import { FHIR_Patient } from "fhir/model/fhir";
import { PatientType } from "models/patient";
import { ElexisType } from "models/elexistype";
import { IQueryResult } from "services/datasource";
import { BaseAdapter } from "./base-adapter";

export class PatientAdapter extends BaseAdapter {
  public path = "patient";

  public toElexisObject(fhirpat: FHIR_Patient): ElexisType {
    const name = super.getName(fhirpat.name);
    const addr = super.getAddress(fhirpat.address, "home");
    const mobile = super.getComm(fhirpat.telecom, "mobile", "phone");
    const tel1 = super.getComm(fhirpat.telecom, "home", "phone");
    const tel2 = super.getComm(fhirpat.telecom, "work", "phone");
    const email = super.getComm(fhirpat.telecom, null, "email");
    const gender = super.getGender(fhirpat.gender);
    const comment = this.getComment(fhirpat);
    const ret: PatientType = {
      id: fhirpat.id,
      bezeichnung1: name.bezeichnung1,
      bezeichnung2: name.bezeichnung2,
      titel: name.titel,
      titelsuffix: name.titelsuffix,
      geburtsdatum: super.getDate(fhirpat.birthDate),
      geschlecht: gender,
      strasse: addr.street,
      plz: addr.zip,
      ort: addr.place,
      telefon1: tel1,
      telefon2: tel2,
      email: email,
      natelnr: mobile,
      bemerkung: comment,
      type: this.path
    };
    return ret;
  }

  public toFhirObject(obj: PatientType): FHIR_Resource {
    const base: FHIR_Resource = super.toFhirObject(obj);
    const ret: FHIR_Patient = Object.assign(base, {
      active: true,
      name: super.makeName(
        obj.titel,
        obj.titelsuffix,
        obj.bezeichnung2,
        obj.bezeichnung1
      ),
      gender: super.makeGender(obj.geschlecht),
      birthDate: super.makeDate(obj.geburtsdatum),
      telecom: super.makeComm(obj),
      address: super.makeAddress(obj)
    });
    this.makeComment(ret, obj)
    return ret;
  }

  public getComment(pat: FHIR_Patient) {
    let found;
    if (pat.extension) {
      found = pat.extension.find(c => c.url === "www.elexis.info/extensions/patient/notes");
    }
    return (found) ? found.valueString : null;
  }

  public makeComment(ret: FHIR_Patient, obj: PatientType) {
    if (obj.bemerkung) {
      ret.extension = []
      ret.extension.push({
        url: "www.elexis.info/extensions/patient/notes",
        valueString: obj.bemerkung
      })
    }
  }

  public transformQuery(q) {
    const ret: any = {};
    ret.name = q.$find;
    if (q.geburtsdatum) {
      ret.birthdate = super.makeDate(q.geburtsdatum);
    }
    return ret;
  }
}
