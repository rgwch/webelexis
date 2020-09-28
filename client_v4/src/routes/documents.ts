import { DocumentManager } from './../models/document-manager';
import { autoinject } from 'aurelia-framework';
import * as moment from 'moment'
import * as env from "../../config/environment.json"

@autoinject
export class Documents {
  concern: string = ""
  expression: string = ""
  docs: Array<string> = []

  constructor(private dm: DocumentManager) { }

  search() {
    this.dm.find("contents:" + (this.expression || "*") + " concern:" + (this.concern || "*")).then(result => {
      result.data.sort((a, b) => {
        const lc = (a.concern || "").localeCompare(b.concern)
        if (lc != 0) {
          return lc
        }
        const ma = moment(a.date)
        const mb = moment(b.date)
        if (ma.isBefore(mb)) {
          return -1;
        }
        if (ma.isAfter(mb)) {
          return 1;
        }
        return (a.title || "").localeCompare(b.title)
      })
      this.docs = result.data
    })
  }

  fetch(id){
    this.dm.fetch(id).then(doc=>{
      const win=window.open(`${env.baseURL}lucindadoc/${id}`, "_blank");
      setTimeout(()=>{
        console.log(win.document.title)
        win.document.title="Hallo"
      },100)
    })
  }
}
