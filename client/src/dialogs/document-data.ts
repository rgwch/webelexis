import { DialogController } from 'aurelia-dialog'
import { autoinject, bindable } from 'aurelia-framework';
import { Doc } from 'models/document';

@autoinject
export class DocumentData{
  data={}

  constructor(private dc:DialogController){}

  activate(doc:Doc){
    this.data={
      subject: doc.obj.subject,
      adressee: doc.obj.addressee
    }
  }

  ok(){
    this.dc.ok(this.data)
  }
}
