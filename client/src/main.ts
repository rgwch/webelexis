import {Aurelia} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import * as Backend from 'i18next-xhr-backend';
import {HttpWrapper} from './services/http-wrapper';
import {DevHttpWrapper} from './services/dev-http-wrapper';
import {LocalHttpWrapper} from "./services/local-http-wrapper";
import {Config} from "./config";

let selectedLanguage = navigator['languages'][0] || navigator.language;
selectedLanguage = selectedLanguage.substr(0, 2);

export function configure(aurelia: Aurelia) {
  return aurelia.loader.loadModule('materialize').then(() => {

    aurelia.use
      .standardConfiguration()
      .developmentLogging()

      .globalResources('resources/date-format-value-converter')

      .plugin('aurelia-i18n', (instance) => {
        instance.i18next.use(Backend);
        return instance.setup({
          backend: {
            loadPath: 'locales/{{lng}}/{{ns}}.json',
          },
          lng : selectedLanguage,
          attributes : ['t','i18n'],
          fallbackLng : 'de',
          debug : true
        });
      })
      .plugin('aurelia-dialog')

      .plugin('aurelia-materialize-bridge', bridge => bridge.useAll())

      let httpWrapper = aurelia.container.get(LocalHttpWrapper);
      //let httpWrapper = aurelia.container.get(DevHttpWrapper);
      aurelia.container.registerInstance(HttpWrapper, httpWrapper);
      let config=aurelia.container.get(Config)
      aurelia.container.registerInstance(Config,config)

      aurelia.start().then(() => aurelia.setRoot());
  });
}
