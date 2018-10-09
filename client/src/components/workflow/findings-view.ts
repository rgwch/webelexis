/********************************************
 * This file is part of Webelexis           *
 * Copyright (c)  2018 by G. Weirich        *
 * License and Terms see LICENSE            *
 ********************************************/

import {FindingsManager,FindingType} from '../../models/findings-model'
import { bindable } from 'aurelia-framework';

export class FindingsView{
  @bindable obj: FindingType

}
