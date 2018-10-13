import { bindable, PLATFORM, useView} from "aurelia-framework";

@useView(PLATFORM.moduleName('./searchfield.pug'))
export class Searchfield{
  st="ha"
  @bindable searchtext
  val
  @bindable result

  doSearch(){
    this.result=this.val
  }
  keyPressed(ev){
    if(ev.keyCode===13){
      this.doSearch()
      //ev.preventDefault();
    }else{
      return true;
    }
  }
}
