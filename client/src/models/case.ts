/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { DateTime } from "./../services/datetime";
import { CaseType } from "./case";
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
  guarantor: UUID;
  patient: UUID;
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
  // sic!
  private patientService: DataService;

  constructor(private ds: DataSource, private dt: DateTime) {
    super(ds.getService("fall"));
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

  public async fetch(id: UUID) {
    return await this.dataService.get(id);
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
      if (fall.patient) {
        fall._Patient = await this.patientService.get(fall.patient);
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
