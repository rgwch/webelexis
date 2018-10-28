import { Patient } from 'models/patient';
import { SelectPatient } from './select-pat';
import { DocType } from './../models/document';
import { DialogController, DialogService } from 'aurelia-dialog'
import { autoinject, bindable } from 'aurelia-framework';

@autoinject
export class DocumentData{
  data={
    subject:"",
    addressee:""
  }
  document

  constructor(private dc:DialogController, private ds:DialogService){}

  activate(doc:DocType){
    this.document=doc
    this.data={
      subject: doc.subject,
      addressee: doc.addressee ? Patient.getLabel(doc.addressee) : ""
    }
  }

  ok(){
    this.dc.ok(this.document)
  }

  selectPatient(){
    this.ds.open({viewModel: SelectPatient, model: this.document}).whenClosed(result=>{
      if(!result.wasCancelled){
        this.document.adressee=result.output
        this.data.addressee=result.output
      }
    })
  }
}
