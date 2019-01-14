import {browser, element, by, By, $, $$, ExpectedConditions} from 'aurelia-protractor-plugin/protractor';
import {config} from '../protractor.conf';
import { logicalExpression } from 'babel-types';


describe('Webelexis', () => {
  beforeEach(async ()=>{
    await browser.loadAndWaitForAureliaPage(`http://localhost:${config.port}`);
    browser.waitForRouterComplete()
    browser.sleep(5000)
  })

  it('finds patient with TitelSuffix "unittest"', async () => {
    await login()
    await browser.sleep(2000)
    const inp = element(by.id('$find_search'))
    console.log("found %s",inp)
    await inp.sendKeys('unittest')
    await browser.sleep(1000)
    await element(by.css('button[type="submit"]')).click()
    const t=await inp.getText
    expect(t).toBe("Hallo")
  })

})

const login = () => {
  return element(by.id('username')).sendKeys("user@webelexis.ch").then(() => {
    return element(by.id("password")).sendKeys("user").then(() => {
      return element(by.css('button[type="submit"')).click()
    })
  })
}
