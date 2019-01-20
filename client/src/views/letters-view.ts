/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { DialogService } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";
import { ShowTemplates } from "./../dialogs/show-templates";
import { BriefManager, BriefType } from "models/briefe-model";
import { DateTime } from "services/datetime";
import { WebelexisEvents } from "webelexisevents";

@autoinject
export class Letters {
  protected searchexpr = "";
  private templatename: string;

  constructor(
    private dlgs: DialogService,
    private bm: BriefManager,
    private dt: DateTime,
    private we: WebelexisEvents
  ) { }

  protected showTemplates() {
    this.dlgs
      .open({ viewModel: ShowTemplates, model: this.templatename })
      .whenClosed(result => {
        if (!result.wasCancelled) {
          this.doCreateLetter(result.output);
        }
      });
  }

  private doCreateLetter(tmpl: BriefType) {
    const pat = this.we.getSelectedItem('patient')
    const brief: BriefType = {
      Betreff: this.templatename,
      Datum: this.dt.DateToElexisDate(new Date()),
      MimeType: "text/html",
      patientid: pat ? pat.id : undefined,
      _Patient: pat ? pat : undefined,
      typ: "Allg.",

    };
    this.bm.generate(brief, tmpl.Betreff, []).then(html => {
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
      }
    })
  }
}
