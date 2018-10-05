import { Patient } from './models/patient';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from './webelexisevents';
import { UserType,User } from './models/user';
import { DataSource } from './services/datasource';
import { Router, RouterConfiguration } from "aurelia-router";
import { LogManager, autoinject, computedFrom } from 'aurelia-framework'
import 'bootstrap'
import {connectTo} from 'aurelia-store'
import { pluck } from 'rxjs/operators'
import { State } from './state';


@connectTo<State>({
  selector: {
    actUser: store => store.state.pipe(pluck("usr")),
    actDate: store => store.state.pipe(pluck("date")),
    actPatient: store=> store.state.pipe(pluck('patient'))
  }
})
@autoinject
export class App {
  public router: Router
  log = LogManager.getLogger('app.ts')
  showLeftPane=true
  actPatient

  constructor(private ds:DataSource, private we:WebelexisEvents){
    this.ds.login().then((usr:UserType)=>{
      const user=new User(usr)
      usr["type"]="usr"
      this.we.selectItem(usr)
    }).catch(err=>{
      console.log("invalid stored token")
    })
  }

  toggleLeftPane(){
    this.showLeftPane=!this.showLeftPane
  }

  @computedFrom('actPatient')
  get title(){
    if(!this.actPatient){
      return "kein Patient ausgewählt"
    }else{
      if(this.actPatient.Bezeichnung1){
        return Patient.getLabel(this.actPatient)
      }else{
        return "?"
      }
    }

  }

  public configureRouter(cfg: RouterConfiguration, router: Router) {
    cfg.title = "Webelexis"
    cfg.map([
      {
        route: ['',"/dispatch/:sub?"],
        name: "dispatch",
        title: "Hauptseite",
        viewPorts:{
          default: {moduleId: 'routes/dispatch/left'},
          details: {moduleId: 'routes/dispatch/right'}
        },
        nav: false
      },{
        route: "/user",
        name: "user",
        title: "Konto",
        viewPorts: {
          default: {moduleId: "routes/user/usermenu"},
          details: {moduleId: "routes/user/userdetail"}
        }
      },
{
        route: '/test/:vi?',
        name: "test",
        viewPorts: {
          default: { moduleId: 'routes/test/index' },
          details: { moduleId: 'routes/test/detail' }
        },
        title: 'test',
        nav: false
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
        viewPorts:{
          default: { moduleId: 'routes/patient/index' },
          details: {moduleId: 'routes/konsultation/index'}
        },
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
