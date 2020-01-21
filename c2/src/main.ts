import { Aurelia } from 'aurelia-framework'
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import { I18N, TCustomAttribute } from 'aurelia-i18n'
import Backend from "i18next-xhr-backend";
import 'bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

let selectedLanguage = navigator.languages[0] || navigator.language;
selectedLanguage = selectedLanguage.substr(0, 2);

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), instance => {
      instance.i18next.use(Backend)
      const aliases = ['t', 'i18n']
      TCustomAttribute.configureAliases(aliases)
      return instance.setup({
        backend: {
          loadPath: './locales/{{lng}}/{{ns}}.json'
        },
        attributes: aliases,
        lng: selectedLanguage,
        fallbacklng: 'de',
        debug: true
      })
    })

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
