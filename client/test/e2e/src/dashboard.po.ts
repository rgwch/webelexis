import {browser, element, by, By, $, $$, ExpectedConditions} from 'aurelia-protractor-plugin/protractor';

export class PageObject_DashboardIndex {
  getTextInputMessage() {
    return element(by.css('.text-input.container > h3')).getText();
  }

  getTextInputValue() {
    return element(by.css('.text-input.container > p')).getText();
  }

  setTextInputValue(value: string) {
    let textInput = element(by.css('.text-input.container')).element(by.valueBind('mdValue'));
    return textInput.clear().then(() => textInput.sendKeys(value));
  }
}
