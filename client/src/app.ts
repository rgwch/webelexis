import { I18N } from 'aurelia-i18n';
import { autoinject } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

@autoinject
export class App {
  router

  constructor(private i18n: I18N) { }

  configureRouter(config, router) {
    this.router = router
    config.title = "Webelexis"
    config.map([
      {
        route: 'login',
        name: "login",
        moduleId: PLATFORM.moduleName("routes/login"),
        nav: false,
        title: this.i18n.tr('menu:login')
      },
      {
        route: 'patient',
        name: "patient",
        moduleId: PLATFORM.moduleName("routes/patient"),
        nav: true,
        title: this.i18n.tr('menu:patient')
      },
      {
        route: ['','agenda'],
        name: "agenda",
        moduleId: PLATFORM.moduleName("routes/agenda"),
        nav: true,
        title: this.i18n.tr('menu:agenda')
      },
      {
        route: "kons",
        name: "kons",
        moduleId: PLATFORM.moduleName("routes/kons"),
        title: this.i18n.tr('menu:kons')
      }, {
        route: "article",
        name: "art",
        moduleId: PLATFORM.moduleName("routes/article"),
        title: this.i18n.tr('menu:art')
      }, {
        route: "documents",
        name: "doc",
        moduleId: PLATFORM.moduleName("routes/documents"),
        title: this.i18n.tr('menu:doc')
      },{
        route: "account",
        name: "account",
        moduleId: PLATFORM.moduleName("routes/account"),
        title: this.i18n.tr('menu:konto')
      }
    ])
  }

}
