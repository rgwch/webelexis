// we need this to inialialize svelte-i18n
import './services/i18n/i18n'
import App from './views/App.svelte'
import { type PatientType, PatientManager } from './models/patient-model';
import def from './services/properties'
import { currentPatient } from './services/store';

// console.log(JSON.stringify(def))
const pm = new PatientManager()
if (def.production == "false") {
  pm.fetch("f545f4a171b7f3093c6285").then(pat => {
    currentPatient.set(pat as PatientType)
  })
}
const app = new App({
  target: document.body,
});

// export default app;
