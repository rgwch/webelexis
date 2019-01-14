import { FhirBundle } from "fhir/model/fhir";
import { ElexisType } from "models/elexistype";
import { KontaktType } from "models/kontakt";
import { IFhirAdapter } from "fhir/fhir-api";
import {
  FHIR_Resource,
  FHIR_HumanName,
  GENDER,
  FHIR_Address,
  FHIR_ContactPoint
} from "./../model/fhir";
import { IQueryResult } from "services/datasource";
import * as moment from "moment";

export abstract class BaseAdapter implements IFhirAdapter {
  public path = "";
  private typeMapper = {
    Patient: "patient",
    patient: "Patient",
    unknown: "Unknown",
    Unknown: "unknown"
  };

  public resourceType() {
    return this.typeMapper[this.path];
  }
  public toElexisObject(fhir: FHIR_Resource): ElexisType {
    return {
      id: fhir.id,
      type: "not set"
    };
  }

  public toFhirObject(eo: ElexisType): FHIR_Resource {
    return {
      id: eo.id,
      resourceType: this.typeMapper[eo.type]
    };
  }

  public toQueryResult(bundle: FhirBundle): IQueryResult {
    if (bundle.resourceType !== "Bundle") {
      throw new Error("invalid bundle received");
    }
    if (bundle.total > 0) {
      return {
        total: bundle.total,
        limit: bundle.total,
        skip: 0,
        data: bundle.entry.map(el => {
          const fhirobj: FHIR_Resource = el.resource;
          return this.toElexisObject(fhirobj);
        })
      };
    } else {
      return {
        total: 0,
        limit: 0,
        skip: 0,
        data: []
      };
    }
  }

  public transformQuery(query: any): any {}
  public getName(fhirnames: FHIR_HumanName[]) {
    let found = fhirnames.find(n => n.use === "usual");
    if (!found) {
      found = fhirnames[0];
    }
    return {
      Bezeichnung1: found.family,
      Bezeichnung2: found.given ? found.given.join(" ") : "",
      Titel: found.prefix ? found.prefix.join(" ") : "",
      TitelSuffix: found.suffix ? found.suffix.join(" ") : ""
    };
  }
  public getAddress(fhiraddrs: FHIR_Address[], use: string) {
    if (!fhiraddrs) {
      return {
        place: "",
        street: "",
        zip: ""
      };
    }
    let found;
    if (use) {
      found = fhiraddrs.find(a => a.use === use);
    }
    if (!found) {
      found = fhiraddrs[0];
    }
    const street = found.line ? found.line[0] : null;
    return {
      place: found.city,
      street,
      zip: found.postalCode
    };
  }

  public getComm(fhircomms: FHIR_ContactPoint[], use: string, system: string) {
    if (!fhircomms) {
      return null;
    }
    const found = fhircomms.find(c => {
      const useok = (use) ? c.use === use : true;
      const sysok = (system) ? c.system === system : true;
      return (useok && sysok);
    });
    return (found) ? found.value : null;
  }

  public getGender(fhirgender: GENDER) {
    switch (fhirgender) {
      case "male":
        return "m";
      case "female":
        return "f";
      default:
        return "?";
    }
  }
  public getDate(fhirdate: string) {
    const m = moment(fhirdate);
    return m.format("YYYYMMDD");
  }

  public makeName(title, suffix, first, last) {
    const ret: FHIR_HumanName = {
      family: last,
      given: first ? [first.split(/\s/g)] : [""],
      prefix: title ? [title.split(/\s/g)] : [""],
      suffix: suffix ? [suffix.split(/\s/g)] : [""],
      text: `${title} ${last} ${first} ${suffix}`,
      use: "official"
    };
    return ret;
  }

  public makeGender(g: string): GENDER {
    switch (g) {
      case "m":
        return "male";
      case "f":
      case "w":
        return "female";
      default:
        return "unknown";
    }
  }

  public makeDate(d: string): string {
    if (d) {
      const m = moment(d, "YYYYMMDD");
      return m.toISOString();
    } else {
      return null;
    }
  }

  public makeAddress(contact: KontaktType): FHIR_Address[] {
    const ret = [];
    ret.push({
      use: "home",
      city: contact.Ort,
      postalCode: contact.plz,
      line: [contact.Strasse]
    });
    return ret;
  }

  public makeComm(contact: KontaktType): FHIR_ContactPoint[] {
    const ret = [];
    if (contact.Email) {
      ret.push({
        system: "email",
        value: contact.Email
      });
    }
    if (contact.Telefon1) {
      ret.push({
        system: "phone",
        use: "work",
        value: contact.Telefon1
      });
    }
    if (contact.Telefon2) {
      ret.push({
        system: "phone",
        use: "home",
        value: contact.Telefon2
      });
    }
    if (contact.NatelNr) {
      ret.push({
        system: "phone",
        use: "mobile",
        value: contact.NatelNr
      });
    }
    return ret;
  }
}
