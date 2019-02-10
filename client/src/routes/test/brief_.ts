import { autoinject } from "aurelia-framework";
import { BriefManager, BriefType } from "models/briefe-model";
import { WebelexisEvents } from "webelexisevents";

@autoinject
export class BriefTest {
  public mann;
  public frau;

  constructor(private bm: BriefManager, private we: WebelexisEvents) {}

  public attached() {
    const pat = this.we.getSelectedItem("patient");
    const brief: BriefType = {
      betreff: "Testbrief",
      datum: "20190102",
      typ: "Allg.",
      mimetype: "text/html",
      patientid: pat.id
    };
    this.bm.generate(brief, "testdoc", []).then(result => {
      this.mann = result;
      brief._Patient.geschlecht = "w";
      brief._Patient.bezeichnung2 = "Rossalina";

      this.bm.generate(brief, "testdoc", []).then(res2 => {
        this.frau = res2
      });
    });
  }
}
