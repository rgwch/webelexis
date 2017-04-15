import {bindable} from 'aurelia-framework';

export class TextInput {
  @bindable public value = '';
  @bindable public label = "write something"
  @bindable public isDisabled = false;
}
