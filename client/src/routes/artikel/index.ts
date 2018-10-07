/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import {ViewerConfiguration} from '../../components/commonviewer'
import { DateTime } from '../../services/datetime';
import {autoinject} from 'aurelia-framework'
import {EventAggregator,Subscription} from 'aurelia-event-aggregator'


@autoinject
export class ArticleView{
  cv:ViewerConfiguration={
    title: "Artikel Auswahl",
    dataType: 'article',
    searchFields: [{
      name: "dscr",
      label: "Medikament",
      asPrefix: true,
      value: ""
    }],
    switches:[
      {
        label:"Blackbox",
        imgURL:"/blackflag",
        falseBefore:(q)=>{q.BB=0;return q}
      },{
        label:"Nonpharma",
        imgURL: "/pharma",
        falseBefore:(q)=>{q.type='P';return q}
      },{
        label:"Nur Generika",
        imgURL: "/generic",
        trueBefore:(q)=>{
          q.$or=[{GENERIC_TYPE:'G'},{GENERIC_TYPE:'X'}]
          return q;
        }
      },{
        label: "Nur SL",
        imgURL: "/sl",
        trueBefore:(q)=>{q.SL_ENTRY="1"; return q}
      }

    ],
    getLabel: (obj)=>{
      return obj.DSCR;
    }
  }


  constructor(private ea:EventAggregator){}

}
