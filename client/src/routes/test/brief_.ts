import { FHIR_MedicationAdministration } from './../../models/fhir/fhir';
import { WebelexisEvents } from 'webelexisevents';
import { BriefManager, BriefType } from 'models/briefe-model';
import { autoinject } from "aurelia-framework";

@autoinject
export class BriefTest {
  mann 
  frau 

  constructor(private bm: BriefManager, private we: WebelexisEvents) { }

  attached() {
    const pat=this.we.getSelectedItem('patient')
    const brief: BriefType = {
      Betreff: "Testbrief",
      Datum: "20190102",
      typ: "Allg.",
      MimeType: "text/html",
      patientid: pat.id
    }
    this.bm.generate(brief, "testdoc", []).then(result=>{
      this.mann=result
      brief._Patient.geschlecht="w"
      brief._Patient.Bezeichnung2="Rossalina"
      
      this.bm.generate(brief, "testdoc", []).then(result=>{
        this.frau=result
      })  
    })
    
  }
}
