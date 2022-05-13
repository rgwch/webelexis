// we need this to inialialize svelte-i18n
import './services/i18n/i18n'
import App from './views/App.svelte';
import {writable, type Writable} from 'svelte/store'
import type { PatientType } from './models/patient-model';

export const currentPatient:Writable<PatientType>=writable()

const app = new App({
  target: document.body,
});

export default app;