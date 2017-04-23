/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import {NavigationInstruction, Next, Redirect, Router, RouterConfiguration} from "aurelia-router";
import {Session} from "./services/session";
import {Container} from "aurelia-dependency-injection";
import {LoginService} from "./services/login";

export class App {
  public router: Router;

  private session: Session;
  private static inject = [Session];

  constructor(session: Session) {
    this.session = session;
  }

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Webelexis';
    config.map([
      {
        route: ['', 'login/:id?'],
        name: 'login',
        moduleId: 'login',
        title: 'Login'
      }, {
        route: 'dashboard',
        name: 'dashboard',
        moduleId: 'routes/dashboard/index',
        title: 'Dashboard',
        nav: true,
        settings: {headerTextKey: 'routes.dashboard'}
      }, {
        route: 'patients',
        name: 'patients',
        moduleId: 'routes/dashboard/index',
        title: 'Patienten',
        nav: true,
        settings: {headerTextKey: 'routes.patients', authRoleId: "mpa"}
      }, {
        route: 'patient/:id?',
        name: 'searchbox-details',
        moduleId: 'routes/dashboard/detail',
        title: 'Patient Details',
        settings: {headerTextKey: 'routes.patients-details', authRoleId: "mpa"}
      }, {
        route: 'agenda',
        name: 'agenda',
        moduleId: 'routes/agenda/index',
        title: 'Agenda',
        nav: true,
        settings: {headerTextKey: 'routes.appointments', authRoleId: "mpa"}
      }, {
        route: 'intro',
        name: 'intro',
        moduleId: 'routes/intro/index',
        title: 'Willkommen bei Webelexis',
        settings: {headerTextKey: 'routes.appointments', authRoleId: "mpa"}
      }, {
        route: 'showcase',
        name: 'showcase',
        moduleId: 'routes/showcase/index',
        title: 'Showcase',
        nav: true,
        settings: {headerTextKey: 'routes.admin', authRoleId: "all"}
      }
    ]);

    config.addPipelineStep('authorize', AuthorizeStep);

    this.router = router;
    //return this.dataStore.primeData();

  }
}

/**
 * Check if the requested route is available for the current user
 * - if there is no roleID associated to a route, or if the roleId is "all", then allow
 * - if there is a roleID and no user is logged in -> redirect to LogIn
 * - if there is a roleID and a user is loggedin, check if they have the requested role. If not, redirect to LogIn
 * - if the current user has the role "admin" the allow always.
 */
class AuthorizeStep {
  run(navInstruction: NavigationInstruction, next: Next): Promise<any> {
    let session: Session = Container.instance.get(Session);
    return this.checkUser(navInstruction).then(actUser => {
      let roleId: string = navInstruction.config.settings ? navInstruction.config.settings.authRoleId : null;
      if (roleId && roleId != "all") {
        if (actUser) {
          let hasRole = actUser.roles.find(role => ((role === roleId) || (role === 'admin')))
          if (!hasRole) {
            console.log("login failure - no matching role for " + roleId)
            alert("Sie haben keine Berechtigung für diese Seite.")
            return next.cancel(new Redirect('login'));
          }
        } else {
          return next.cancel(new Redirect('login'));
        }

      }
      return next();
    })
  }

  /**
   * Validate currentUser
   * - session.currentUser exists
   * - - id-param exists: check if they match, log out else
   * - - no id-param: check if user is logged in
   * - no session.currentUser
   * - - id-param exists: fetch associated user
   * @param nav
   * @returns {Promise<any>}
   */
  async checkUser(nav: NavigationInstruction) {
    let session: Session = Container.instance.get(Session);
    let loginService = Container.instance.get(LoginService);
    let actUser = session.getUser()
    let guid = nav.params['id']
    if (actUser) {
      if (actUser.guid) {
        if (guid === actUser.guid) {
          return actUser
        }
      }
      let loggedInUser = await
        loginService.isLoggedIn(actUser.id)
      if (loggedInUser.guid) {
        actUser.guid = loggedInUser.guid
        return actUser
      }
      session.logout()
    } else {
      if (guid) {
        let result = await loginService.getUser(guid)
        if (result && result.id) {
          result.guid = guid
          session.login(result)
          return result
        }

      }
    }
    return actUser
  }
}
