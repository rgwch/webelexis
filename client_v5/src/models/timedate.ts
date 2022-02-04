import { _ } from 'svelte-i18n'

let trl
_.subscribe(val => { trl = val })

export const monthNames = [
    trl("cal.jan") || "january",
    trl("cal.feb") || "february",
    trl("cal.mar") || "march",
    trl("cal.apr") || "april",
    trl("cal.mai") || "may",
    trl("cal.jun") || "june",
    trl("cal.jul") || "july",
    trl("cal.aug") || "august",
    trl("cal.sep") || "september",
    trl("cal.oct") || "october",
    trl("cal.nov") || "november",
    trl("cal.dec") || "december",
];
export const weekDays = [
    trl("cal.mon") || "monday",
    trl("cal.tue") || "tuesday",
    trl("cal.wed") || "wednesday",
    trl("cal.thu") || "thursday",
    trl("cal.fri") || "friday",
    trl("cal.sat") || "saturday",
    trl("cal.sun") || "sunday",
];
export const weekDaysShort = [
    trl("cal.mo") || "mon",
    trl("cal.tu") || "tue",
    trl("cal.we") || "wed",
    trl("cal.th") || "thu",
    trl("cal.fr") || "fri",
    trl("cal.sa") || "sat",
    trl("cal.su") || "sun",
];
