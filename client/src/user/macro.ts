import { WebelexisEvents } from './../webelexisevents';
import { autoinject } from 'aurelia-framework';
import { DataSource, DataService } from '../services/datasource';

@autoinject
export class Macroprocessor {
  private patients: DataService
  private findings: DataService

  constructor(private ds: DataSource, private we: WebelexisEvents) {
    this.patients = ds.getService('patient')
    this.findings = ds.getService('findings')
  }
  process(context: "encounter" | "document", word: string) {
    if (context === 'encounter') {
      if (word.match(/[0-9]{1,3}\/[0-9]{1,3}/)) {
        const finding = this.createFinding("Blutdruck", word)
        return finding.name + ": " + finding.value

      } else {
        switch (word) {
          case "gw": return "Gewicht";
          case "bd": return "Blutdruck";
          case "kons": return `**S:**\n**O:**\nB:\n**P:**\n`
          default: return "bubblegum";
        }
      }
    } else if (context === 'document') {

    }
  }

  createFinding(name, value) {
    const actPat = this.we.getSelectedItem('patient')
    const actUser = this.we.getSelectedItem('usr')
    const finding = {
      date: new Date(),
      patient: actPat.id,
      user: actUser.id,
      name: name,
      value: value
    }
    this.findings.create(finding).then(created=>{
      console.log("finding created")
    })
    return finding;
  }
}
