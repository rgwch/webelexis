/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from './webelexisevents';
import { UserType, User } from './models/user';
import { DataSource } from './services/datasource';
import { Router, RouterConfiguration } from "aurelia-router";
import { LogManager, autoinject, computedFrom, PLATFORM } from 'aurelia-framework'
import 'bootstrap'
import { connectTo } from 'aurelia-store'
import { pluck } from 'rxjs/operators'
import { State } from './state';
import { I18N } from 'aurelia-i18n';
import { Patient } from './models/patient';
import env from 'environment'
import 'bootstrap/dist/css/bootstrap.css'
import 'styles.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'


/**
 * Starting point for the UI. Gets called from main.ts#configure()
 * Here, the Router configuration takes place. The constructor tries to
 * log in the current user
 */
@connectTo<State>({
  selector: {
    actUser: store => store.state.pipe(<any>pluck("usr")),
    actDate: store => store.state.pipe(<any>pluck("date")),
    actPatient: store => store.state.pipe(<any>pluck('patient')),
    leftPanel: store=>store.state.pipe(<any>pluck('leftPanel'))
  }
})
@autoinject
export class App {
  public router: Router
  log = LogManager.getLogger('app.ts')
  leftPanel
  actPatient
 
  constructor(private ds: DataSource, private we: WebelexisEvents, private i18n: I18N) {
    // this.log.setLevel(LogManager.logLevel.info)
    this.log.info("getting metadata from "+env.baseURL)
    fetch(env.baseURL+"metadata").then(response=>{
      return response.json()
    }).then(json=>{
      env["metadata"]=json
      this.router.title=env.metadata["sitename"]
    }).catch(err=>{
      alert(this.i18n.tr("errmsg.connect"))
    })
    this.ds.login().then((usr: UserType) => {
      const user = new User(usr)
      usr["type"] = "usr"
      this.we.selectItem(usr)
    }).catch(err => {
      console.log("invalid stored token")
    })
  }

  @computedFrom('actPatient')
  get title() {
    if (!this.actPatient) {
      return this.i18n.tr("info.nopatselected") //"kein Patient ausgewählt"
    } else {
      if (this.actPatient.Bezeichnung1) {
        return Patient.getLabel(this.actPatient)
      } else {
        return "?"
      }
    }

  }

  public configureRouter(cfg: RouterConfiguration, router: Router) {
    cfg.title = ""
    cfg.map([
      {
        route: ['', "dispatch/:sub?"],
        name: "dispatch",
        // title: env.metadata["sitename"],
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName('./routes/dispatch/left') },
          details: { moduleId: PLATFORM.moduleName('./routes/dispatch/right') }
        },
        nav: false
      }, {
        route: "/user/:vi?",
        name: "user",
        title: this.i18n.tr("nav.account"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/user/index") },
          details: { moduleId: PLATFORM.moduleName("./routes/user/detail") }
        }
      },
      {
        route: '/test/:vi?',
        name: "test",
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName('./routes/test/index') },
          details: { moduleId: PLATFORM.moduleName('./routes/test/detail') }
        },
        title: 'test',
        nav: false
      },
      {
        route: '/agenda',
        name: "agenda",
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName('./routes/patient/index') },
          details: { moduleId: PLATFORM.moduleName('./routes/agenda/index') }
        },
        title: this.i18n.tr("nav.agenda"),
        nav: true
      }, {
        route: "/termin",
        name: "termin",
        title: "Termin",
        moduleId: PLATFORM.moduleName('./routes/agenda/index'),
        nav: true
      }, {
        route: "/patient",
        name: "patient",
        title: this.i18n.tr("nav.patdetails"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName('./routes/patient/index') },
          details: { moduleId: PLATFORM.moduleName('./routes/patient/detail') }
        },

        nav: true
      }, {
        route: "patient/neu",
        name: "patneu",
        title: this.i18n.tr("nav.newpat"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName('./routes/patient/index') },
          details: { moduleId: PLATFORM.moduleName('./routes/patient/detail') }
        }
      }, {
        route: "/konsultation",
        name: "konsultation",
        title: this.i18n.tr("nav.encounters"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName('./routes/patient/index') },
          //details: { moduleId: PLATFORM.moduleName('./routes/konsultation/index') }
        },
        nav: true
      }, {
        route: "/artikel",
        name: "artikel",
        title: this.i18n.tr("nav.articles"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName('./routes/artikel/index') },
          details: { moduleId: PLATFORM.moduleName('./routes/artikel/detail') }
        },
        nav: true
      }, {
        route: "/documents",
        name: "documents",
        title: this.i18n.tr("nav.documents"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName('./routes/documents/list') },
          details: { moduleId: PLATFORM.moduleName('views/document') }
        }
      }
    ])
    this.log.info("router configuration ok")
    this.router = router;
  }
}
