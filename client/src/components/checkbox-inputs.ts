/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {bindable} from 'aurelia-framework';

export class CheckboxInputs {
  @bindable public items = [];
  @bindable public selectedValues = [];
  @bindable public displayProp = '';
}
