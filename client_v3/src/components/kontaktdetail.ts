/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { bindable} from 'aurelia-framework'
import {KontaktType} from '../models/kontakt'

export class KontaktDetail{
    @bindable kontakt:KontaktType

}