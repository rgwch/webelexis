import {bindable} from 'aurelia-framework';

export class RadioInputs {
  @bindable public items = [];
  @bindable public selectedValue;
  @bindable public displayProp = '';

  private uniqueName = `radio-${getRandomInt()}`;
}

function getRandomInt() {
  return Math.random() * (100000 - 1) + 1;
}
