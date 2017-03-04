import {bindable} from 'aurelia-framework';

export class TextArea {
  @bindable public value = '';
  @bindable public isDisabled = false;
}
