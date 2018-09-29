import { Document } from './components/document';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { NavigationInstruction, Next, Redirect, Router, RouterConfiguration } from "aurelia-router";
import { LogManager } from 'aurelia-framework'
import 'bootstrap'


export class App {
  public router: Router
  log = LogManager.getLogger('app.ts')
  showLeftPane=true

  toggleLeftPane(){
    this.showLeftPane=!this.showLeftPane
  }
  public configureRouter(cfg: RouterConfiguration, router: Router) {
    cfg.title = "Webelexis"
    cfg.map([
      {
        route: ['',"/dispatch"],
        name: "dispatch",
        title: "Hauptseite",
        viewPorts:{
          default: {moduleId: 'routes/dispatch/left'},
          details: {moduleId: 'routes/dispatch/right'}
        },
        nav: true
      },{
        route: "/user",
        name: "user",
        title: "Konto",
        viewPorts: {
          default: {moduleId: "routes/user/usermenu"},
          details: {moduleId: "routes/user/user"}
        }
      },
{
        route: '/test',
        name: "test",
        viewPorts: {
          default: { moduleId: 'routes/test/index' },
          details: { moduleId: 'routes/test/editor' }
        },
        title: 'test',
        nav: true
      },
      {
        route: '/agenda',
        name: "agenda",
        viewPorts: {
          default: { moduleId: 'routes/patient/index' },
          details: { moduleId: 'routes/agenda/index' }
        },
        title: 'Agenda',
        nav: true
      }, {
        route: "/termin",
        name: "termin",
        title: "Termin",
        moduleId: 'routes/agenda/index',
        nav: true
      }, {
        route: "/patient",
        name: "patient",
        title: "Patient",
        viewPorts: {
          default: { moduleId: 'routes/patient/index' },
          details: { moduleId: 'routes/patient/detail' }
        },

        nav: true
      }, {
        route: "patient/neu",
        name: "patneu",
        title: "Neuer Patient",
        viewPorts: {
          default: { moduleId: 'routes/patient/index' },
          details: { moduleId: 'routes/patient/detail' }
        }
      }, {
        route: "/konsultation",
        name: "konsultation",
        title: "Konsultation",
        moduleId: 'routes/konsultation/index',
        nav: true
      }, {
        route: "/artikel",
        name: "artikel",
        title: "Artikel",
        viewPorts: {
          default: { moduleId: 'routes/artikel/index' },
          details: { moduleId: 'routes/artikel/detail' }
        },
        nav: true
      },{
        route:"/documents",
        name:"documents",
        title:"Dokumente",
        viewPorts:{
          default: {moduleId: 'routes/documents/list'},
          details: {moduleId: 'components/document'}
        }
      }
    ])
    this.log.info("router configuration ok")
    this.router = router;
  }
}
