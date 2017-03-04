import {bindable} from 'aurelia-framework';

export class ItemCollection {
  @bindable public items = [];
  @bindable public displayProp = '';
}
