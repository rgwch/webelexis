import { addMessages, init } from 'svelte-i18n';

import en from './en.json'
import de from './de.json'
import fr from './fr.json'
import it from './it.json'

addMessages('en', en);
addMessages('de', de);
addMessages('fr', fr);
addMessages('it', it);
/*
register('en', ()=> import("./en.json"))
register('de', ()=> import("./de.json"))
register('it', ()=> import("./it.json"))
register('fr', ()=> import("./fr.json"))
*/

init({
    fallbackLocale: 'en',
    initialLocale: 'de'
})

export function setLocale(locale: string) {
    init({
        initialLocale: locale,
        fallbackLocale: 'en'
    })
}
