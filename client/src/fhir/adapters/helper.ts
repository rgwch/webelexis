import {
  FHIR_Address,
  FHIR_ContactPoint,
  FHIR_HumanName
} from "fhir/model/fhir";
import * as moment from 'moment'
import { GENDER } from './../model/fhir';

export class Helper {
  public static getName(fhirnames: FHIR_HumanName[]) {
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
  public static getAddress(fhiraddrs: FHIR_Address[], use: string) {
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

  public static getComm(fhircomms: FHIR_ContactPoint[], use: string) {
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

  public static getGender(fhirgender: GENDER) {
    switch (fhirgender) {
      case "male": return "m"
      case "female": return "f"
      default: return "?"
    }
  }
  public static getDate(fhirdate: string) {
    const m = moment(fhirdate)
    return m.format("YYYYMMDD")
  }
}
