/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { DateTime } from "../services/datetime";
import { PatientType } from "./patient";
import { KontaktType } from "./kontakt";
import { autoinject, Container } from "aurelia-framework";
import { DataSource, DataService } from "../services/datasource";
import { I18N } from "aurelia-i18n";
import { ElexisType, UUID } from "./elexistype";
import { ObjectManager } from "./object-manager";

const i18 = Container.instance.get(I18N);
/**
 * An Elexis "Fall"
 */
export interface CaseType extends ElexisType {
  garantid: UUID;
  patientid: UUID;
  kostentrid: UUID;
  bezeichnung: string;
  grund: "Krankheit" | "Unfall" | "Mutterschaft";
  gesetz: string;
  datumvon: string;
  datumbis?: string;
  extinfo?: any;
  extjson?: any;
  _Patient?: PatientType;
}

@autoinject
export class CaseManager extends ObjectManager{

  private patientService: DataService;

  constructor(ds: DataSource, private dt: DateTime) {
    super('fall');
    this.patientService = ds.getService("patient");
  }

  /**
   * Fetch all cases for a given patient
   * @param id UUID of the patient
   */
  public async loadCasesFor(id: UUID) {
    const result = await this.dataService.find({ query: { patientid: id } });
    if (result && result.data) {
      return result.data;
    }
  }

  public async save(fall: CaseType) {
    delete fall._Patient;
    if (fall.id) {
      return await this.dataService.update(fall.id, fall);
    } else {
      return await this.dataService.create(fall);
    }
  }
  public async getPatient(fall: CaseType) {
    if (!fall._Patient) {
      if (fall.patientid) {
        fall._Patient = await this.patientService.get(fall.patientid);
      }
    }
    return fall._Patient;
  }
  public getLabel(obj: CaseType) {
    const beginDate = this.dt.ElexisDateToLocalDate(obj.datumvon);
    let gesetz = obj.gesetz;
    if (!gesetz) {
      if (obj.extjson) {
        gesetz = obj.extjson.billing;
      }
    }
    return `${gesetz || "KVG?"}/${obj.grund}: ${beginDate} - ${
      obj.bezeichnung
    }`;
  }
}

@autoinject
export class CaseModel {
  constructor(private obj: CaseType) {}
}
