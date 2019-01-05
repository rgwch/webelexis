import { WebelexisEvents } from './../test/unit/dummyevents';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { Aurelia, PLATFORM, LogManager } from 'aurelia-framework';
import * as Backend from 'i18next-xhr-backend';
import { webelexisState } from './state'
import { DataSource } from './services/datasource'
import { FeathersDS } from './services/feathers-api'
import { ConsoleAppender } from 'aurelia-logging-console'
let selectedLanguage = navigator['languages'][0] || navigator.language;
selectedLanguage = selectedLanguage.substr(0, 2);

import environment from './environment';
import { UserType } from 'models/user';

LogManager.addAppender(new ConsoleAppender())
if (environment.debug) {
  LogManager.setLevel(LogManager.logLevel.debug)
} else {
  LogManager.setLevel(LogManager.logLevel.info)
}

/**
 * Main entry point. The aurelia framework calls this with the singleton instance of Aurelia
 * all pre-launch configuration must happen here. Upon finishing, we call app.ts to continue launch.
 * @param aurelia 
 */
export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .globalResources(PLATFORM.moduleName('services/date-format'))
    .globalResources(PLATFORM.moduleName('services/checkrole'))
    .feature(PLATFORM.moduleName('validation/index'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
      instance.i18next.use(Backend);
      return instance.setup({
        backend: {
          loadPath: './locales/{{lng}}/{{ns}}.json',
        },
        lng: selectedLanguage,
        attributes: ['t', 'i18n'],
        fallbackLng: 'de',
        debug: true
      });
    })
    .plugin(PLATFORM.moduleName('aurelia-animator-css'))
    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    /*
    .plugin(PLATFORM.moduleName('aurelia-mousetrap'),config=>{
      config.set('keymap', {
        "?": "KS_SEARCH",
        "n": "KS_NEW"
      });
    })
    */
    .plugin(PLATFORM.moduleName('aurelia-store'), { initialState: webelexisState })

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  const datasource = aurelia.container.get(FeathersDS)
  aurelia.container.registerInstance(DataSource, datasource)
  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
