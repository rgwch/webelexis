import { _ } from 'svelte-i18n'
import { setLocale } from './i18n'

describe("i18n", () => {
    let trl
    let unsubscribe
    beforeAll(() => {
        unsubscribe = _.subscribe(data => {
            trl = data
        })
    })
    afterAll(() => {
        unsubscribe()
    })
    it("translates a string", () => {
        setLocale("de")
        expect(trl("cal.mon")).toEqual("Montag")
        setLocale("en")
        expect(trl("cal.mon")).toEqual("Monday")
        setLocale("fr")
        expect(trl("cal.mon")).toEqual("Lundi")
        setLocale("it")
        expect(trl("cal.mon")).toEqual("Lunedi")
    })
})