import { bindable, PLATFORM, useView} from "aurelia-framework";

@useView(PLATFORM.moduleName('./searchfield.html'))
export class Searchfield{
  st="ha"
  @bindable searchtext
  val
  @bindable result

  bind(context){
    console.log(this.val)
    console.log(this.searchtext)
  }

  doSearch(){
    console.log(this.val)
    this.result=this.val
  }
}
