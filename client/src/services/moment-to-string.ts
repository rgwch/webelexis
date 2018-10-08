import { I18N } from 'aurelia-i18n';
import { ValueConverter, valueConverter } from "aurelia-binding";
import * as moment from 'moment'
import { autoinject } from "aurelia-framework";

@autoinject
@valueConverter('MomentToString')
export class MomentToStringValueConverter{

  constructor(private i18:I18N){}

  toView(mom:moment.Moment){
    mom=mom || moment()
    return mom.format(this.i18.tr('adapters.time_format'))
  }

  fromView(str){
    return moment(str,this.i18.tr('adapters.time_format'))
  }
}
