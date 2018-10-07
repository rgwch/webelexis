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


@connectTo<State>({
  selector: {
    actUser: store => store.state.pipe(<any>pluck("usr")),
    actDate: store => store.state.pipe(<any>pluck("date")),
    actPatient: store => store.state.pipe(<any>pluck('patient'))
  }
})
@autoinject
export class App {
  public router: Router
  log = LogManager.getLogger('app.ts')
  showLeftPane = true
  actPatient
  // actUser

  constructor(private ds: DataSource, private we: WebelexisEvents, private i18n: I18N) {
    this.ds.login().then((usr: UserType) => {
      const user = new User(usr)
      usr["type"] = "usr"
      // this.actUser=usr
      this.we.selectItem(usr)
    }).catch(err => {
      console.log("invalid stored token")
    })
  }

  toggleLeftPane() {
    this.showLeftPane = !this.showLeftPane
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
    cfg.title = "Webelexis"
    cfg.map([
      {
        route: ['', "dispatch/:sub?"],
        name: "dispatch",
        title: this.i18n.tr("nav.maintitle"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName('./routes/dispatch/left') },
          details: { moduleId: PLATFORM.moduleName('./routes/dispatch/right') }
        },
        nav: false
      }, {
        route: "/user",
        name: "user",
        title: this.i18n.tr("nav.account"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/user/usermenu") },
          details: { moduleId: PLATFORM.moduleName("./routes/user/userdetail") }
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
        title: this.i18n.tr("pat details"),
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
          details: { moduleId: PLATFORM.moduleName('./components/document') }
        }
      }
    ])
    this.log.info("router configuration ok")
    this.router = router;
  }
}
