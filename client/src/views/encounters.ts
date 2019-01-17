/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 List of elexis encounters of the currently selected patient
*/
import { bindable } from "aurelia-framework";
import { autoinject, observable } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { EncounterType } from "models/encounter-model";
import * as moment from "moment";
import { pluck } from "rxjs/operators";
import { CaseManager } from "../models/case";
import { UserType } from "../models/user";
import { DataService, DataSource } from "../services/datasource";
import { State } from "../state";
import defaults from "../user/global";
import { WebelexisEvents } from "../webelexisevents";
const numberToFetch = 20;

@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(pluck("patient") as any)
    // actCase: store=>store.state.pipe(pluck('case')),
    // actKons: store => store.state.pipe(<any>pluck('konsultation'))
  }
})
export class Encounters {
  @observable
  protected actCase;
  @observable
  protected searchexpr;

  private encounters = {
    data: [],
    skip: 0,
    total: 10000000
  };
  private cases = [];

  private scrollTop = 0;

  private konsultationService: DataService;
  private actPatient;
  private encdom;
  private canCreate = true;

  constructor(
    private ds: DataSource,
    private caseManager: CaseManager,
    private we: WebelexisEvents
  ) {
    this.konsultationService = this.ds.getService("konsultation");
  }

  public attached() {
    this.konsultationService.on("created", this.consActions);
    this.konsultationService.on("updated", this.consActions);
    this.konsultationService.on("removed", this.consActions);
    this.refresh();
  }

  public detached() {
    this.konsultationService.off("created", this.consActions);
    this.konsultationService.off("updated", this.consActions);
    this.konsultationService.off("deleted", this.consActions);
  }

  protected scroll() {
    if (this.encounters.data.length < this.encounters.total) {
      this.fetchData();
    }
  }

  protected actPatientChanged(newValue, oldValue) {
    // console.log("act "+(this.actPatient ? this.actPatient.id : "empty"))
    // console.log("new: "+(newValue ? newValue.id: "empty"))
    // console.log("old: "+(oldValue ? oldValue.id: "empty"))
    if (!oldValue || newValue.id !== oldValue.id) {
      this.actCase = null;
      this.searchexpr = "";
      this.refresh();
    }
  }

  protected actCaseChanged(newValue, oldValue) {
    this.refresh();
  }

  protected searchexprChanged(newval, oldval) {
    this.refresh();
  }

  /**
   * create a new encounter. A case must be selected
   */
  protected newEncounter() {
    if (this.actCase != null) {
      const fall = this.actCase;
      const user: UserType = this.we.getSelectedItem("usr");
      let mandator = user.id;
      if (user.elexiskontakt) {
        if (user.elexiskontakt.istmandant == "1") {
          mandator = user.elexiskontakt.id;
        }
      }
      const kons: EncounterType = {
        Zeit: moment().format("HH:mm:ss"),
        datum: moment().format("YYYYMMDD"),
        eintrag: {
          html: "<p></p>",
          remark: user.label,
          timestamp: moment().format("DD.MM.YYYY, HH:mm:ss")
        },
        fallid: this.actCase.id,
        mandantid: defaults.mandator || mandator
      };
      this.konsultationService
        .create(kons)
        .then()
        .catch(err => {
          if (err.code == 400) {
            alert(
              "The database could not handle the request. Please make sure that the server is running and that the database has the necessary modifications for webelexis."
            );
          } else {
            alert("Could not save");
          }
        });
    }
  }

  /**
   * On create, remove or update events just reload, if it's our business.
   */
  private consActions = (obj: EncounterType) => {
    const concern = this.cases.find(fall => fall.id === obj.fallid);
    if (concern && (this.actCase == null || concern.id === this.actCase.id)) {
      this.refresh();
    }
  };

  /**
   * reload the encounter list completely
   */
  private refresh() {
    setTimeout(() => {
      // async needed for ckeditor to work correctly
      this.encounters.total = 1000000;
      this.encounters.data = [];
      this.encounters.skip = 0;
      // console.log("act: "+(this.actPatient ? this.actPatient.id : "empty"))
      this.fetchData().then(result => {
        if (this.encounters.data.length > 0) {
          const act = this.encounters.data[0];
          if (act.eintrag.html.replace(/<.*?>/g, "") == "") {
            const children = this.encdom.getElementsByTagName("encounter");
            if (children && children.length > 0) {
              const lastKons = children[0];
              // TODO: Activate edit mode
            }
          }
        }
      });
    });
  }

  /**
   * Fetch new data.
   */
  private fetchData() {
    let isLoading: boolean;
    if (isLoading) {
      console.log("busy");
      return;
    }
    if (
      this.actPatient &&
      this.encounters.data.length < this.encounters.total
    ) {
      isLoading = true;
      const expr: any = {
        $limit: numberToFetch,
        $skip: this.encounters.data.length,
        patientId: this.actPatient.id
      };

      //  if a case (Fall) is selected, fetch only encounters for that case
      if (this.actCase != null) {
        expr.fallid = this.actCase.id;
      }
      // if a searchexpression is given, use it
      if (this.searchexpr && this.searchexpr.length > 1) {
        expr.$find = this.searchexpr;
      }
      const elms = [];
      if (expr.$limit > 0) {
        // console.log(`Lastitem: ${this.encounters.data.length}, total: ${this.encounters.total}, loading: ` + JSON.stringify(expr))
        elms.push(
          this.konsultationService.find({ query: expr }).then(result => {
            this.encounters.data = this.encounters.data.concat(result.data);
            this.encounters.total = result.total;
          })
        );
      } else {
        console.log("no reloading");
      }
      elms.push(
        this.caseManager.loadCasesFor(this.actPatient.id).then(result => {
          this.cases = result;
        })
      );
      return Promise.all(elms).then(r => {
        isLoading = false;
        return true;
      });
    } else {
      this.encounters.data = [];
      this.cases = [];
      return Promise.resolve(true);
    }
  }
}
