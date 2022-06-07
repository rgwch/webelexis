// we need this to inialialize svelte-i18n
import './services/i18n/i18n'
import App from './views/App.svelte'
import { type PatientType, PatientManager } from './models/patient-model';
import { UserManager } from './models/user-model';
import type { UserType } from './models/user-model';
import type { KontaktType } from './models/kontakt-model'
import def from './services/properties'
import { currentActor, currentPatient, currentUser } from './services/store';

// console.log(JSON.stringify(def))
if (def.production == "false") {
  const pm = new PatientManager()
  const um = new UserManager()
  pm.fetch("f545f4a171b7f3093c6285").then(pat => {
    currentPatient.set(pat as PatientType)
  })
  um.fetch("gerry").then((user: UserType) => {
    currentUser.set(user)
    um.getActiveMandatorFor(user).then((actor: KontaktType) => {
      currentActor.set(actor)
    })
  })
}
const app = new App({
  target: document.body,
});

// export default app;
