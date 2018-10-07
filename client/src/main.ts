import { StickerManager } from './models/stickers.model';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { Aurelia, PLATFORM } from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import * as Backend from 'i18next-xhr-backend';
import * as LogManager from 'aurelia-logging'
import {webelexisState} from './state'
import {DataSource} from './services/datasource'
import {FeathersDS} from './services/feathers-api'

let selectedLanguage = navigator['languages'][0] || navigator.language;
selectedLanguage = selectedLanguage.substr(0, 2);

import environment from './environment';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    // .feature(PLATFORM.moduleName('./resources'))
    // .globalResources('resources/date-format-value-converter')
    //.feature(PLATFORM.moduleName('./validation'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
      instance.i18next.use(Backend);
      return instance.setup({
        backend    : {
          loadPath: './locales/{{lng}}/{{ns}}.json',
        },
        lng        : selectedLanguage,
        attributes : ['t', 'i18n'],
        fallbackLng: 'de',
        debug      : true
      });
    })
    /*
    .plugin(PLATFORM.moduleName('aurelia-mousetrap'),config=>{
      config.set('keymap', {
        "?": "KS_SEARCH",
        "n": "KS_NEW"
      });
    })
    */
    .plugin(PLATFORM.moduleName('aurelia-store'),{initialState: webelexisState})
    // .plugin('aurelia-dialog')
  if (environment.debug) {
    aurelia.use.developmentLogging();
    LogManager.logLevel.debug
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  const datasource=aurelia.container.get(FeathersDS)
  aurelia.container.registerInstance(DataSource,datasource)

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
