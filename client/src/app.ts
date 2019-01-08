import { PatientType } from './models/patient';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  autoinject,
  computedFrom,
  LogManager,
  PLATFORM
} from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import {
  NavigationInstruction,
  Next,
  Redirect,
  Router,
  RouterConfiguration
} from "aurelia-router";
import { connectTo } from "aurelia-store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import env from "environment";
import { pluck } from "rxjs/operators";
import { Session } from "services/session";
import "styles.scss";
import { Patient } from "./models/patient";
import { User, UserType } from "./models/user";
import { DataSource } from "./services/datasource";
import { State } from "./state";
import { WebelexisEvents } from "./webelexisevents";

/**
 * Starting point for the UI. Gets called from main.ts#configure()
 * Here, the Router configuration takes place. The constructor tries to
 * log in the current user
 */
@connectTo<State>({
  selector: {
    actUser: store => store.state.pipe(pluck("usr") as any),
    actDate: store => store.state.pipe(pluck("date") as any),
    actPatient: store => store.state.pipe(pluck("patient") as any),
    leftPanel: store => store.state.pipe(pluck("leftPanel") as any)
  }
})
@autoinject
export class App {
  public leftPanel;
  public router: Router;

  private log = LogManager.getLogger("app.ts");
  private actPatient: PatientType;

  constructor(private i18n: I18N, private session: Session) {}

  public activate() {
    this.log.info("getting metadata from " + env.baseURL);
    return fetch(env.baseURL + "metadata")
      .then(response => {
        return response.json();
      })
      .then(json => {
        env["metadata"] = json;
      })
      .catch(err => {
        this.log.error("activate" + err);
        alert(this.i18n.tr("errmsg.connect"));
      });
  }

  @computedFrom("actPatient")
  get title() {
    if (!this.actPatient) {
      return this.i18n.tr("info.nopatselected"); // "kein Patient ausgewählt"
    } else {
      if (this.actPatient.Bezeichnung1) {
        return Patient.getLabel(this.actPatient);
      } else {
        return "?";
      }
    }
  }

  public configureRouter(cfg: RouterConfiguration, router: Router) {
    cfg.title = env.metadata["sitename"] || "Webelexis";

    cfg.map([
      {
        name: "dispatch",
        nav: false,
        route: ["", "dispatch/:sub?"],
        settings: { loginRequired: true },
        title: env.metadata["sitename"],
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/dispatch/left") },
          details: { moduleId: PLATFORM.moduleName("./routes/dispatch/right") }
        }
      },
      {
        name: "user",
        route: "/user/:vi?",
        title: this.i18n.tr("nav.account"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/user/index") },
          details: { moduleId: PLATFORM.moduleName("./routes/user/detail") }
        }
      },
      {
        name: "test",
        nav: false,
        route: "/test/:vi?",
        title: "test",
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/test/index") },
          details: { moduleId: PLATFORM.moduleName("./routes/test/detail") }
        }
      },
      {
        name: "agenda",
        nav: true,
        route: "/agenda",
        title: this.i18n.tr("nav.agenda"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/patient/index") },
          details: { moduleId: PLATFORM.moduleName("./routes/agenda/index") }
        }
      },
      /*
      {
        name: "termin",
        nav: true,
        route: "/termin",
        title: "Termin",
        moduleId: PLATFORM.moduleName("./routes/agenda/index"),
      },*/
      {
        name: "patient",
        nav: true,
        route: "/patient",
        title: this.i18n.tr("nav.patdetails"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/patient/index") },
          details: { moduleId: PLATFORM.moduleName("./routes/patient/detail") }
        }
      },
      {
        name: "patneu",
        route: "patient/neu",
        title: this.i18n.tr("nav.newpat"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/patient/index") },
          details: { moduleId: PLATFORM.moduleName("./routes/patient/detail") }
        }
      },
      {
        route: "/konsultation",
        name: "konsultation",
        title: this.i18n.tr("nav.encounters"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/patient/index") }
          // details: { moduleId: PLATFORM.moduleName('./routes/konsultation/index') }
        },
        nav: true
      },
      {
        route: "/artikel",
        name: "artikel",
        title: this.i18n.tr("nav.articles"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/artikel/index") },
          details: { moduleId: PLATFORM.moduleName("./routes/artikel/detail") }
        },
        nav: true
      },
      {
        route: "/documents",
        name: "documents",
        title: this.i18n.tr("nav.documents"),
        viewPorts: {
          default: { moduleId: PLATFORM.moduleName("./routes/documents/list") },
          details: { moduleId: PLATFORM.moduleName("views/document") }
        }
      }
    ]);
    cfg.addPipelineStep("authorize", AuthorizeStep);
    this.log.info("router configuration ok");
    this.router = router;
  }
}

@autoinject
class AuthorizeStep {
  constructor(private session: Session) {}
  public run(navInstruction: NavigationInstruction, next: Next): Promise<any> {
    return this.session.getUser().then(actUser => {
      if (
        navInstruction.config.settings &&
        navInstruction.config.settings.loginRequired
      ) {
        if (actUser) {
          return next();
        } else {
          return next.cancel(new Redirect("user/login"));
        }
      } else {
        return next();
      }
    });
  }
}
