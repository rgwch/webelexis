import { I18N } from "aurelia-i18n";
import { autoinject } from "aurelia-framework";

@autoinject
export class NumberFormatValueConverter{

  constructor(private i18: I18N) {}
  public toView(num: number, mode: "cents"){
    const br = Math.round(num) / 100
    return this.i18.tr("billing.currency") + " " + br
  }
}
