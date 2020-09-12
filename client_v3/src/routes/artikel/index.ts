/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { ViewerConfiguration } from "../../components/commonviewer"
import { autoinject } from "aurelia-framework"
import { EventAggregator } from "aurelia-event-aggregator"

@autoinject
export class ArticleView {
  public cv: ViewerConfiguration = {
    title: "Artikel Auswahl",
    dataType: "article",
    searchFields: [
      {
        name: "dscr",
        label: "Medikament",
        asPrefix: true,
        value: ""
      }
    ],
    switches: [
      {
        label: "Blackbox",
        imgURL: "/blackflag",
        falseBefore: q => {
          q.bb = 0
          return q
        }
      },
      {
        label: "Nonpharma",
        imgURL: "/pharma",
        falseBefore: q => {
          q.type = "P"
          return q
        }
      },
      {
        label: "Nur Generika",
        imgURL: "/generic",
        trueBefore: q => {
          q.$or = [{ generic_type: "G" }, { generic_type: "X" }]
          return q
        }
      },
      {
        label: "Nur SL",
        imgURL: "/sl",
        trueBefore: q => {
          q.sl_entry = "1"
          return q
        }
      }
    ],
    getLabel: obj => {
      return obj.dscr
    }
  }

  constructor(private ea: EventAggregator) {}
}
