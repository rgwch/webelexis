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
  RouterConfiguration,
  RedirectToRoute
} from "aurelia-router";
import { connectTo } from "aurelia-store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import env from "environment";
import { pluck } from "rxjs/operators";
import { Session } from "services/session";
import "styles.scss";
import { Patient } from "./models/patient";
import { DataSource } from "./services/datasource";
import { State } from "./state";
import { PatientType } from "./models/patient";

/**
 * Starting point for the UI. Gets called from main.ts#configure()
 * Here, the Router configuration takes place. The constructor tries to
 * log in the current user
 */
@connectTo<State>({
  selector: {
    actDate: store => store.state.pipe(pluck("date") as any),
    actPatient: store => store.state.pipe(pluck("patient") as any),
    actUser: store => store.state.pipe(pluck("usr") as any),
    leftPanel: store => store.state.pipe(pluck("leftPanel") as any)
  }
})
@autoinject
export class App {
  public router: Router;

  private log = LogManager.getLogger("app.ts");
  private actPatient: PatientType;

  constructor(
    private i18n: I18N,
    private session: Session,
    private ds: DataSource
  ) {}

  /**
   * When activationg the main view: Wait for metadata of the configured server
   */
  public activate() {
    return this.ds.metadata();
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
        moduleId: PLATFORM.moduleName("./routes/dispatch/index"),
        name: "dispatch",
        nav: false,
        route: ["", "dispatch/:sub?"],
        settings: { loginRequired: true },
        title: env.metadata["sitename"]
      },
      {
        moduleId: PLATFORM.moduleName("./routes/user/index"),
        name: "user",
        route: "/user/:vi?",
        title: this.i18n.tr("nav.account")
      },
      {
        moduleId: PLATFORM.moduleName("./routes/test/index"),
        name: "test",
        nav: false,
        route: "/test/:vi?",
        title: "test"
      },
      {
        moduleId: PLATFORM.moduleName("fhir/fhir-login"),
        name: "Fhir Login",
        route: "/fhirlogin"
      },
      {
        moduleId: PLATFORM.moduleName("fhir/fhir-ready"),
        name: "Fhir authenticated",
        route: "/auth"
      },
      {
        moduleId: PLATFORM.moduleName("routes/login/stage1"),
        name: "default-login",
        route: "/login"
      },
      {
        moduleId: PLATFORM.moduleName("routes/login/stage2"),
        name: "default_loggedin",
        route: "/loggedin"
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
          if (env.transport === "fhir") {
            return next.cancel(new Redirect("fhirlogin"));
          } else {
            return next.cancel(new RedirectToRoute("default-login"));
          }
        }
      } else {
        return next();
      }
    });
  }
}
