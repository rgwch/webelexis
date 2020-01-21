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
      { route: ['', 'login'], name: "login", moduleId: "routes/login", nav: true, title: this.i18n.tr('menu:login') },
      { route: 'patient', name: "patient", moduleId: "routes/patient", nav: true, title: this.i18n.tr('menu:patient') },
      { route: 'agenda', name: "agenda", moduleId: "routes/agenda", nav: true, title: this.i18n.tr('menu:agenda') }
    ])
  }

}
