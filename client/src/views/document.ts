/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { DialogService } from "aurelia-dialog";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import {
  autoinject,
  bindable,
  computedFrom,
  observable
} from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";
import { DocumentData } from "../dialogs/document-data";
import { DocManager, DocType } from "../models/document-model";
import { ElexisType } from "../models/elexistype";
import { Patient } from "../models/patient";
import { DataService, DataSource } from "../services/datasource";
import { State } from "../state";
import { WebelexisEvents } from "../webelexisevents";

/**
 * Abstraction for Documents of different kinds
 */
@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe( pluck("patient") as any),
    obj: store => store.state.pipe(pluck("documents") as any)
  }
})
export class Document {
  @observable
  public obj: DocType;

  private templates: DocType[];
  private docService: DataService;
  private tmplService: DataService;
  private htmlText: string;
  @observable
  private actPatient;
  private setsubject: any;

  constructor(
    private ea: EventAggregator,
    private ds: DataSource,
    private dispatcher: WebelexisEvents,
    private dlgs: DialogService,
    private dm: DocManager
  ) {
    this.docService = this.ds.getService("documents");
    this.tmplService = this.ds.getService("templates");
    this.dispatcher.selectItem(this.obj);
  }

  public attached() {
    this.tmplService.find().then(templates => {
      this.templates = templates.data;
    });
  }

  /**
   * Display a modal dialog (bootstrap modal) to enter/accept a subject line for the document.
   */
  protected doSave() {
    this.dlgs
      .open({ viewModel: DocumentData, model: this.obj })
      .whenClosed(result => {
        if (!result.wasCancelled) {
          console.log(result.output);
        }
      });
    /*
    $('#subjectinput').val(this.obj.subject)
    $('#subjectdlg').modal('show')
    $('#subjectdlg').on('hidden.bs.modal', e => {
      $('#subjectdlg').modal('dispose')
      console.log("destroyed")
    })
    $('#subjectdlg').on('click', '.btn-primary', () => {
      this.obj.subject = $('#subjectinput').val()
      $('#subjectdlg').modal('hide')
      if (this.obj.id) {
        this.docService.update(this.obj.id, this.obj).then(updated => {
          console.log("Updated " + JSON.stringify(updated))

        }).catch(err => {
          alert(err)
        })
      } else {
        this.obj.date = new Date()
        this.docService.create(this.obj).then(created => {
          console.log("Created " + JSON.stringify(created))
          this.obj.id = created.id
          // some storage systems (e.g. mongo, nedb) add automatically an _id
          if (created._id) {
            this.obj["_id"] = created._id
          }
        }).catch(err => {
          alert(err)
        })
      }
    })
    */
  }

  protected doSaveTemplate() {
    // console.log("save template")
    delete this.obj.concern;
    delete this.obj.id;
    delete this.obj["_id"];
    return this.doSave();
  }

  protected doDelete() {
    // console.log("delete")
    if (this.obj.id) {
      this.docService.remove(this.obj.id);
    }
  }
  private actPatientChanged(newvalue: ElexisType, oldvalue: ElexisType) {
    this.obj.concern = newvalue;
  }

  private objChanged(newValue, oldValue) {
    if (newValue && newValue.contents) {
      this.htmlText = newValue.contents;
    }
  }

  @computedFrom("obj.concern", "obj.subject")
  protected get title() {
    let t = "";
    if (this.obj) {
      if (this.obj.concern) {
        t = Patient.getLabel(this.obj.concern) + " - ";
      } else {
        t = "Kein Patient ausgewählt - ";
      }
      if (this.obj.subject) {
        t += this.obj.subject;
      } else {
        t += " - Kein Dokumenttitel gesetzt";
      }
    } else {
      t = "Kein Patient gewählt - kein Titel gesetzt";
    }
    return t;
  }
}
