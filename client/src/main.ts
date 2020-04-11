import { ConsoleAppender } from 'aurelia-logging-console';
import { IDataSource } from './services/dataservice';
import { FeathersDS } from './services/feathers-api'
import { AppState } from './services/app-state';
import { Aurelia, LogManager } from 'aurelia-framework'
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import { TCustomAttribute } from 'aurelia-i18n'
import Backend from "i18next-xhr-backend";
import 'bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import env from "environment"

let selectedLanguage = navigator.languages[0] || navigator.language;
selectedLanguage = selectedLanguage.substr(0, 2);

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), instance => {
      instance.i18next.use(Backend)
      const aliases = ['t', 'i18n']
      TCustomAttribute.configureAliases(aliases)
      return instance.setup({
        attributes: aliases,
        lng: 'de', //selectedLanguage,
        fallbacklng: 'de',
        ns: ['menu', 'translation'],
        defaultNs: 'translation',
        backend: {
          loadPath: './locales/{{lng}}/{{ns}}.json'
        },
        debug: environment.debug
      })
    })
    .plugin(PLATFORM.moduleName('aurelia-ui-virtualization'))

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');
  // LogManager.addAppender(new ConsoleAppender())
  // LogManager.setLevel(LogManager.logLevel.info)  // Chrome doesn't show "debug" level.

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  let datasource: IDataSource
  if (env.transport === 'fhir') {

  } else {
    datasource = aurelia.container.get(FeathersDS)
  }
  aurelia.container.registerInstance("DataSource", datasource)
  const appState = aurelia.container.get(AppState)

  await aurelia.start()
  await aurelia.setRoot(PLATFORM.moduleName("routes/launching"))
  await appState.login()
  aurelia.setRoot(PLATFORM.moduleName('app')).catch(err=>{
    console.log("Acttivation failed! "+err)
  })


}
