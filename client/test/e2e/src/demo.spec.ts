import {PageObject_DashboardIndex} from './dashboard.po';
import {PageObject_Skeleton} from './skeleton.po';
import {browser, element, by, By, $, $$, ExpectedConditions} from 'aurelia-protractor-plugin/protractor';
import {} from 'jasmine';

describe('aurelia skeleton app', function() {
  let po_dashboard: PageObject_DashboardIndex;
  let po_skeleton: PageObject_Skeleton;

  beforeEach( () => {
    po_skeleton = new PageObject_Skeleton();
    po_dashboard = new PageObject_DashboardIndex();

    browser.loadAndWaitForAureliaPage("http://localhost:9000/#/dashboard");
  });

  it('should load the page and display the initial page title', () => {
    expect(po_skeleton.getCurrentPageTitle()).toBe('Dashboard | Elexis');
  });

  it('should show dashboard', () => {
    expect(po_dashboard.getTextInputMessage()).toBe('Text Input');
  });

  it('should tell the user what they wrote', () => {
    let textValue = 'Testing';
    po_dashboard.setTextInputValue(textValue);

    browser.sleep(200);

    expect(po_dashboard.getTextInputValue()).toBe(`You wrote ${textValue}`);
  });
});
