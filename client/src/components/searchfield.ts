import { bindable, PLATFORM, useView} from "aurelia-framework";

@useView(PLATFORM.moduleName('./searchfield.pug'))
export class Searchfield{
  st="ha"
  @bindable searchtext

}
