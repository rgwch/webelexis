/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022.2023 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

 import 'virtual:windi.css'
// we need this to inialialize svelte-i18n
import './services/i18n/i18n'
import App from './views/App.svelte'
import { type PatientType, PatientManager } from './models/patient-model';
import def from './services/properties'
import { currentPatient } from './services/store';
import { userManager as um } from './models'

/*
If we are in debug mode, the server will send credentials, so we can auto-login and preload our "Testperson" fake-patient
*/
fetch(def.server + "/metadata").then(async result => {
  if (result.ok) {
    def.metadata = await result.json()
    const auto = def.metadata["autologin"]
    if (auto && auto.username) {
      const user = await um.login(auto.username, auto.password)
      if (def.production == "false") {
        const pm = new PatientManager()
        const pats = await pm.find({ query: { bezeichnung1: "Testperson" } })
        if (pats.total > 0) {
          currentPatient.set(pats.data[0] as PatientType)
        }

      }
    }
  } else {
    alert("could not connect to server " + result.statusText)
  }
})
const app = new App({
  // target: document.body,
  target: document.getElementById('app')
});

export default app;
