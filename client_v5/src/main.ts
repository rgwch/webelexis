// we need this to inialialize svelte-i18n
import './services/i18n/i18n'
import App from './views/App.svelte'
import { type PatientType, PatientManager } from './models/patient-model';
import def from './services/properties'
import { currentPatient } from './services/store';
import { login } from './services/io'

// console.log(JSON.stringify(def))
fetch(def.server + "/metadata").then(async result => {
  if (result.ok) {
    def.metadata = await result.json()
    const auto = def.metadata["autologin"]
    if (auto && auto.username) {
      const user = await login(auto.username, auto.password)
      if (def.production == "false") {
        const pm = new PatientManager()
        const pat = await pm.fetch("f545f4a171b7f3093c6285")
        currentPatient.set(pat as PatientType)
      }
    }
  } else {
    alert("could not connect to server " + result.statusText)
  }
})
const app = new App({
  target: document.body,
});

// export default app;
