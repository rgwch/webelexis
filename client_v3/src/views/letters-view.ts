/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { DialogService } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";
import { ShowTemplates } from "../dialogs/show-templates";
import { BriefManager, BriefType } from "models/briefe-model";
import { DateTime } from "services/datetime";
import { WebelexisEvents } from "webelexisevents";
import { EventAggregator } from "aurelia-event-aggregator";
import { DISPLAY, SWITCH_PANELS } from "routes/dispatch";
import { LetterView } from "./letter-view";

@autoinject
export class Letters {
  protected searchexpr = "";
  private templatename: string;

  constructor(
    private dlgs: DialogService,
    private bm: BriefManager,
    private dt: DateTime,
    private we: WebelexisEvents,
    private ea: EventAggregator
  ) { }

  protected showTemplates() {
    this.dlgs
      .open({ viewModel: ShowTemplates, model: this.templatename })
      .whenClosed(result => {
        if (!result.wasCancelled) {
          return this.doCreateLetter(result.output);
        }
      });
  }

  private doCreateLetter(tmpl: BriefType) {
    const pat = this.we.getSelectedItem('patient')
    const brief: BriefType = {
      betreff: this.templatename,
      datum: this.dt.DateToElexisDate(new Date()),
      mimetype: "text/html",
      patientid: pat ? pat.id : undefined,
      _Patient: pat ? pat : undefined,
      typ: "Allg.",

    };
    return this.bm.generate(brief, tmpl.betreff, []).then(processed => {
      this.ea.publish(SWITCH_PANELS,{right: "brief"})
      setTimeout(()=>{
        this.ea.publish(LetterView.EDIT_LETTER,processed)
      },50)
      /*
      const win = window.open("", "_new");
      if (!win) {
        alert(
          "Bitte stellen Sie sicher, dass dieses Programm Popups öffnen darf"
        );
      } else {
        win.document.write(html);
        // Allow freshly opened window to load css and render
        setTimeout(() => {
          win.print();
        }, 50);
      } */
    })   
  }
}
