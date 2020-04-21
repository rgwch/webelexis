import { autoinject, bindable } from 'aurelia-framework';
import { Animator } from 'aurelia-templating'
import './collapse.scss'

export interface IAction {
  exec: (obj) => void
  name: string
  icon: string
}

@autoinject
export class Collapse {
  isExpanded: boolean = false
  collapsible: HTMLElement
  @bindable actions: Array<IAction>

  constructor(private animator: Animator) { }

  toggle() {
    if (!this.isExpanded) {
      this.isExpanded = true
      this.animator.animate(this.collapsible, 'opening')

    } else {
      return this.animator.animate(this.collapsible, 'closing').then(() => {
        this.isExpanded = false        
      })
    }
    console.log("toggle")
  }
}
