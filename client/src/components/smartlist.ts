import { bindable } from 'aurelia-framework';
import './smartlist.scss'

export interface LabelProvider {
  getHtml(obj): string
  getText(obj): string
}

export class Smartlist {
  @bindable elements
  @bindable labelprovider: LabelProvider = {
    getHtml: (obj) => {
      return obj.toString()
    },
    getText: (obj) => {
      return obj.toString()
    }
  }

  attached(){
    for(const el of this.elements){
      console.log(el)
    }
  }

}
