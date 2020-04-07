import { AppState } from './services/app-state';
import { Router, Redirect } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';
import { autoinject} from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';


@autoinject
export class App {
  router

  constructor(private i18n: I18N) {
    console.log("app")
   }

  configureRouter(config, router) {
    this.router = router
    config.title = "Webelexis"
    //config.addAuthorizeStep(AuthorizeStep)
    config.map([
      {
        route: 'login',
        name: "login",
        moduleId: PLATFORM.moduleName("routes/login"),
        nav: false,
        title: this.i18n.tr('menu:login'),
        auth: 'visitor'
      },
      {
        route: 'patient',
        name: "patient",
        moduleId: PLATFORM.moduleName("routes/patient"),
        nav: true,
        title: this.i18n.tr('menu:patient'),
        auth: 'user'
      },
      {
        route: ['','agenda'],
        name: "agenda",
        moduleId: PLATFORM.moduleName("routes/agenda"),
        nav: true,
        title: this.i18n.tr('menu:agenda'),
        auth: 'user'
      },
      {
        route: "kons",
        name: "kons",
        moduleId: PLATFORM.moduleName("routes/kons"),
        title: this.i18n.tr('menu:kons'),
        auth: 'user'
      }, {
        route: "article",
        name: "art",
        moduleId: PLATFORM.moduleName("routes/article"),
        title: this.i18n.tr('menu:art'),
        auth: 'user'
      }, {
        route: "documents",
        name: "doc",
        moduleId: PLATFORM.moduleName("routes/documents"),
        title: this.i18n.tr('menu:doc'),
        auth: 'user'
      }
    ])
  }

}
/*
@autoinject
class AuthorizeStep{

  constructor(private appState:AppState){}
  run(nav,next){
    if(nav.config.auth=='visitor'){
      return next()
    }else{
      if(this.appState.isLoggedIn() && this.appState.loggedInUser.roles.includes(nav.config.auth)){
        return next()
      }else{
        return  new Redirect("login")
      }
    }
  }
  
}

*/
