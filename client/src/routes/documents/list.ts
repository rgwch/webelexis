/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { Store } from 'aurelia-store';
import { inlineView, Container } from "aurelia-framework";
import { ViewerConfiguration } from '../../components/commonviewer'

@inlineView(`
<template>
    <require from="../../components/commonviewer"></require>
        <div>
            <common-viewer cv_cfg.bind="cv"></common-viewer>
        </div>
    </div>
</template>
`)
export class Documents{
  cv:ViewerConfiguration={
    title: "Dokumente",
    dataType: 'documents',
    searchFields:[{
      name: "$find",
      label: "Suchbegriffe",
      asPrefix:false,
      value: ""
    }],
    switches: [{
      label: "Nur aktueller Patient",
      imgURL: "/static/blackflag",
      trueBefore: this.currentPatient
    }],
    getLabel: (obj) => obj.subject

  }

  currentPatient(query){
    const st=Container.instance.get(Store)
    const actPat=st._state._value['patient']
    if(actPat){
      query.concern=actPat.id
    }
    return query
  }
}
