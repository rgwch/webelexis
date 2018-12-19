import { Kontakt } from './../models/kontakt';
import { Patient } from 'models/patient';
import { SelectKontakt } from './select-kontakt';
import { DocType } from './../models/document-model';
import { DialogController, DialogService } from 'aurelia-dialog'
import { autoinject, bindable } from 'aurelia-framework';

@autoinject
export class DocumentData {
  data = {
    subject: "",
    addressee: ""
  }
  document

  constructor(private dc: DialogController, private ds: DialogService) { }

  activate(doc: DocType) {
    this.document = doc
    this.data.subject = doc.subject
    //this.data.addressee = doc. ? Patient.getLabel(doc.addressee) : "Adressat"

  }

  ok() {
    this.dc.ok(this.document)
  }

  selectAddressee() {
    this.ds.open({ viewModel: SelectKontakt, model: this.document }).whenClosed(result => {
      if (!result.wasCancelled) {
        this.document.adressee = result.output
        this.data.addressee = result.output ? Kontakt.getLabel(result.output) : "Adressat"
      }
    })
  }
}
