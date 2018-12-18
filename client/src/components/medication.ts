import { BindingSignaler } from 'aurelia-templating-resources';
import { bindable, autoinject} from "aurelia-framework";
import { PrescriptionManager, PrescriptionType } from "models/prescription-model";

@autoinject
export class Medication {
  @bindable obj:PrescriptionType
  expanded=false;
  constructor(private pm: PrescriptionManager, private signaler:BindingSignaler) { }

  getLabel() {
    let lbl=""
    const o=this.obj
    if (o) {
      if (o.ANZAHL) {
        lbl += o.ANZAHL.toString() + " "
      }
      if (o.Artikel && o.Artikel["DSCR"]) {
        lbl += o.Artikel["DSCR"]
      }else{
        lbl+="?"
      }
      if(o.Dosis){
        lbl+=" "+o.Dosis
      }
      if(o.Bemerkung){
        lbl+=" ("+o.Bemerkung+")"
      }
    }
    return lbl
  }

  drag(event) {
    event.dataTransfer.setData("text", event.target.id)
    console.log("drag: "+event.target.id)
    return true
  }

  expand(){
    this.expanded=!this.expanded
  }

  save(){
    this.pm.save(this.obj).then(s=>{
      this.signaler.signal('update')
    })
  }
}
