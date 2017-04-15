/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {bindable} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n'
import {inject} from 'aurelia-dependency-injection'

@inject(I18N)
export class Searchfield {

  constructor(private i18) {}

  @bindable public value: string = '';
  @bindable public label = this.i18.tr("search.label")
  @bindable public isDisabled = false;
  @bindable public handler;

}
