/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { PLATFORM } from 'aurelia-framework';

export default {
  details: {
    name: "Anwenderdaten",
    view: PLATFORM.moduleName('./userdetails')
  },
  lostpwd: {
    name: "Passwort vergessen",
    view: PLATFORM.moduleName('./lostpassword')
  },
  manageusers: {
    acl: "user.update",
    name: "Anwender verwalten",
    view: PLATFORM.moduleName('./manageuser')
  }
}
