import { FhirBundle } from 'fhir/model/fhir';
import { ElexisType } from 'models/elexistype';
import { IFhirAdapter } from 'fhir/fhir-api';
import { FHIR_Resource, FHIR_HumanName, GENDER, FHIR_Address, FHIR_ContactPoint } from './../model/fhir';
import { IQueryResult } from 'services/datasource';
import * as moment from 'moment'

export abstract class BaseAdapter implements IFhirAdapter {
  public path = ""
  private typeMapper = {
    Patient: "patient",
    patient: "Patient",
  }

  public toElexisObject(fhir: FHIR_Resource): ElexisType {
    return {
      id: fhir.id,
      type: fhir.resourceType
    }
  }

  public toFhirObject(eo: ElexisType): FHIR_Resource {
    return {
      id: eo.id,
      resourceType: this.typeMapper[eo.type]
    }
  }

  public toQueryResult(i: FhirBundle): IQueryResult {
    return null
  }

  public getName(fhirnames: FHIR_HumanName[]) {
    let found = fhirnames.find(n => n.use === "usual");
    if (!found) {
      found = fhirnames[0];
    }
    return {
      Bezeichnung1: found.family.join(" "),
      Bezeichnung2: found.given.join(" "),
      Bezeichnung3: found.suffix.join(" ")
    };
  }
  public getAddress(fhiraddrs: FHIR_Address[], use: string) {
    let found;
    if (use) {
      found = fhiraddrs.find(a => a.use === use);
    }
    if (!found) {
      found = fhiraddrs[0];
    }
    return {
      place: found.city,
      street: found.line[0],
      zip: found.postalCode
    };
  }

  public getComm(fhircomms: FHIR_ContactPoint[], use: string) {
    let found;
    if (use) {
      found = fhircomms.find(c => c.use === use);
    }
    if (!found) {
      found = fhircomms[0];
    }
    return {
      mail: found.mail,
      phone: found.phone
    };
  }

  public getGender(fhirgender: GENDER) {
    switch (fhirgender) {
      case "male": return "m"
      case "female": return "f"
      default: return "?"
    }
  }
  public getDate(fhirdate: string) {
    const m = moment(fhirdate)
    return m.format("YYYYMMDD")
  }

  public makeName(title, suffix, first, last) {
    const ret: FHIR_HumanName = {
      family: [last],
      given: [first],
      prefix: [title],
      suffix: [suffix],
      text: `${last} ${first}`,
      use: "usual"
    }
    return ret
  }

  public makeGender(g: string): GENDER {
    switch (g) {
      case "m": return "male"
      case "f":
      case "w": return "female"
      default: return "unknown"
    }
  }

  public makeDate(d: string) : string{
    const m = moment(d, "YYYYMMDD")
    return m.toISOString()
  }
}
