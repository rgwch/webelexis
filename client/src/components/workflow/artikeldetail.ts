/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import {FlexformConfig} from '../flexform'
import { bindable, computedFrom, autoinject } from 'aurelia-framework';
import { connectTo } from 'aurelia-store';
import { pluck } from 'rxjs/operators';
import * as num from 'numeral'
import { I18N } from 'aurelia-i18n';

@connectTo(store=>store.state.pipe(<any>pluck("article")))
@autoinject
export class ArtikelDetail{
  @bindable article;
  money={
    toForm: (val)=>num(val).format("0.00"),
    toData: (val)=>num(val).value()
  }

  constructor(private i18:I18N){

  }
  smallcols="xs-6 sm-4 md-2"
  ff:FlexformConfig={
    title: ()=>this.title,
    attributes:[
      {
        attribute: "DSCR",
        label: this.i18.tr('article.name'),
        sizehint: 12
      },{
        attribute: "PEXF",
        label: this.i18.tr("article.buy"),
        sizehint: this.smallcols,
        datatype: this.money
      },{
        attribute: "PPUB",
        label: this.i18.tr("article.sell"),
        sizehint: this.smallcols,
        datatype: this.money
      },{
        attribute: "PKG_SIZE",
        label: this.i18.tr("article.size"),
        sizehint: this.smallcols,
      },{
        attribute: "Istbestand",
        label: this.i18.tr("article.instore"),
        sizehint: this.smallcols,
      },{
        attribute: "Maxbestand",
        label: this.i18.tr("article.maxstore"),
        sizehint: this.smallcols,
      },{
        attribute: "Minbestand",
        label: this.i18.tr("article.minstore"),
        sizehint: this.smallcols,
      },{
        attribute: "Anbruch",
        label: this.i18.tr("article.opened"),
        sizehint: this.smallcols,
      }

    ]
  }
  @computedFrom('obj')
  get title(){
    return this.i18.tr("article.pagetitle")
  }

}
