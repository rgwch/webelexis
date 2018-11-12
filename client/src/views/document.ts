/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from '../webelexisevents';
import { Patient } from '../models/patient';
import { bindable, computedFrom, autoinject, observable } from 'aurelia-framework';
import { DocType, Doc } from '../models/document'
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { DataSource, DataService } from '../services/datasource';
import { State } from '../state';
import { pluck } from 'rxjs/operators'
import { connectTo } from 'aurelia-store'
import { ElexisType } from '../models/elexistype';
import { DialogService } from 'aurelia-dialog';
import { DocumentData} from '../dialogs/document-data'

/**
 * Abstraction for Documents of different kinds
 */
@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(<any>pluck('patient')),
    obj: store => store.state.pipe(<any>pluck('documents'))
  }
})
export class Document {
  @observable obj: DocType

  templates: Array<DocType>
  private docService: DataService
  private tmplService: DataService
  htmlText: string
  @observable actPatient
  setsubject: any


  actPatientChanged(newvalue: ElexisType, oldvalue: ElexisType) {
    this.obj.concern = newvalue
    this.htmlText = this.obj.contents
  }

  objChanged(newValue, oldValue) {
    if (newValue && newValue.contents) {
      this.htmlText = newValue.contents
    }
  }

  @computedFrom('obj.concern', 'obj.subject')
  get title() {
    let t = ""
    if (this.obj) {
      if (this.obj.concern) {
        t = Patient.getLabel(this.obj.concern) + " - "
      } else {
        t = "Kein Patient ausgewählt - "
      }
      if (this.obj.subject) {
        t += this.obj.subject
      } else {
        t += " - Kein Dokumenttitel gesetzt"
      }
    } else {
      t = "Kein Patient gewählt - kein Titel gesetzt"
    }
    return t;
  }

  constructor(private ea: EventAggregator, private ds: DataSource,
    private dispatcher: WebelexisEvents, private dlgs: DialogService) {
    this.docService = this.ds.getService('documents')
    this.tmplService = this.ds.getService('templates')
    this.dispatcher.selectItem(this.obj)
  }


  attached() {
    this.tmplService.find().then(templates => {
      this.templates = templates.data
    })

  }

  detached() {

  }

  fromTemplate(template: DocType) {
    delete this.obj.id
    delete this.obj["_id"]
    this.obj.subject = template.subject
    this.obj.template = template.id
    this.obj.concern = this.actPatient
    const doc = new Doc(this.obj)
    this.obj.contents = doc.getEditable(template.contents)
    this.htmlText = this.obj.contents
    this.dispatcher.selectItem(this.obj)
  }

  /**
   * Display a modal dialog (bootstrap modal) to enter/accept a subject line for the document.
   */
  doSave() {
    this.dlgs.open({ viewModel: DocumentData, model: this.obj}).whenClosed(result => {
      if (!result.wasCancelled) {
        console.log(result.output)
      }
    })
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

  async doCreatePdf() {
    const doc = new Doc(this.obj)
    let result = this.obj.contents
    if (this.obj.template) {
      const template = await this.docService.get(this.obj.template)
      if (template) {
        // result = doc.mergeWithTemplate(template)
        //const pdf=await this.dataService.toPDF(merged)
        //return pdf
      }
    }
    const win = window.open("", "_new")
    win.document.write(result)
  }

  doSaveTemplate() {
    console.log("save template")
    this.obj.template = "1"
    delete this.obj.concern
    delete this.obj.id
    delete this.obj["_id"]
    return this.doSave()
  }

  doDelete() {
    console.log("delete")
    if (this.obj.id) {
      this.docService.remove(this.obj.id)
    }
    this.obj = {
      date: new Date(),
      contents: "",
      type: "documents"
    }
    this.dispatcher.selectItem(this.obj)
  }
}
