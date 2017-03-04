import {bindable} from 'aurelia-framework';

export class CheckboxInputs {
  @bindable public items = [];
  @bindable public selectedValues = [];
  @bindable public displayProp = '';
}
