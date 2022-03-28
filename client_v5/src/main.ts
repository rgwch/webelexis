// we need this to inialialize svelte-i18n
import './services/i18n/i18n'
import App from './views/App.svelte';

const app = new App({
  target: document.body,
});

export default app;