import {bindable} from "aurelia-framework";
export class Unit {

  toggleExpanded() {
    this.expanded = !this.expanded
  }

  @bindable image: string
  @bindable caption: string
  @bindable inner: string
  expanded: boolean = false
}
