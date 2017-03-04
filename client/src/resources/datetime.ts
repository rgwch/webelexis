import {I18N} from 'aurelia-i18n'
import {inject} from 'aurelia-framework'
import * as moment from 'moment'

@inject(I18N)
export class DateTime{

    constructor(private i18){
    }

    public toDate(mom:string){
        return moment(mom).format(this.i18.tr('adapters.date_format'))
    }
}
