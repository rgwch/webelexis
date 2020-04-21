import { bindable } from 'aurelia-framework';

/**
 * A generic search box. bind "searchtext" to the placeholder and "result" two-way to the value.
 * Observe the result to trigger a search
 */
export class SearchField{
  @bindable searchtext
  @bindable result
  val

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
