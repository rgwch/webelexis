import { Aurelia } from 'aurelia-framework'
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import { I18N, Backend, TCustomAttribute } from 'aurelia-i18n'

let selectedLanguage = navigator.languages[0] || navigator.language;
selectedLanguage = selectedLanguage.substr(0, 2);

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), instance => {
      let aliases = ['t', 'i18n']
      TCustomAttribute.configureAliases(aliases)
      instance.i18next.use(Backend.with(aurelia.loader))
      return instance.setup({
        backend: {
          loadPath: './locales/{{lng}}({{ns}}.json'
        },
        attributes: aliases,
        lng: selectedLanguage,
        fallbacklng: 'de',
        debug: false
      })
    })

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
