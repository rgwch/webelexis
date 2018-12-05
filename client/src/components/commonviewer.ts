/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { DataSource, DataService } from '../services/datasource'
import { autoinject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { EventBinding, Keyhandler } from '../services/keyhandler'
import { WebelexisEvents } from '../webelexisevents'
import {BindingSignaler} from 'aurelia-templating-resources'
import {FlexformConfig} from './flexform'

/**
  CommonViewer: Loosely adapted from the Elexis class with the same name: A display to uniformely retrieve, filter and display a list of objects of a subtype of "Service".
  First, create a ViewerConfiguration with the desired parameters, then create a CommonViewer and transmit the ViewerConfiguration via Aurelia-template binding.
  If the ViewerConfiguration contains a createDef, the Viewer will present a "New Item" button to display a Dialog box to create a new Object of its type.
*/
export interface ViewerConfiguration {
  // datatype to handle. Name must match the according DataService
  dataType: string
  // Title of the View
  title: string;

  // filter fields to create at the top of the viewer
  searchFields: Array<
  {
    name: string,       // name of field in the storage
    label: string,      // display of the field in the UI
    asPrefix?: boolean, // if true, add a '%' to the contents
    value?: string      // receives user input
  }>,
  // optional array of switches to add to the filters
  switches?: Array<
  {
    label: string,      // tooltip of the switch
    imgURL?: string,    // URL of an image for the switch
    falseBefore?: (query: any) => any,  // functions to modify query before sending
    trueBefore?: (query: any) => any,
    falseAfter?: (result: any) => any,  // functions to modify the result after receiving
    trueAfter?: (result: any) => any,
    value?: boolean     // value of the switch
  }>,
  // function to create a label for each object of the list
  getLabel: (obj) => string
  // Show "new object" Button and create Dialog with FlexFormConfig if pushed
  createDef?: FlexformConfig
  handleError?: (err)=>void
}

@autoinject
export class CommonViewer {
  @bindable cv_cfg: ViewerConfiguration
  items:Array<any>
  selectedItem:string=""  // referenced in view
  private dataService: DataService
  private newobj={}

  constructor(private ea: EventAggregator,
    private kh: Keyhandler, private dispatcher: WebelexisEvents,
    private dataSource: DataSource, private signaler:BindingSignaler) { }

  attached() {
    if (!this.cv_cfg.switches) {
      this.cv_cfg.switches = []
    }
    const binding: EventBinding = {
      event: "KS_SEARCH",
      handler: (ev) => {
        console.log("search")
      }
    }
    this.kh.subscribe("commonviewer", binding)
    this.dataService = this.dataSource.getService(this.cv_cfg.dataType)

    // react on updated elements
    this.dataService.on("updated",msg=>{
      this.doFilter()
    })
    // react on new elements
    this.dataService.on("created",msg=>{
      this.doFilter()
    })

  }

  /**
   * reload list. First, apply searchFields, second apply "before" switch functions if given
   * Then send feathers.find(). On the ruslt, apply "after" switch functions, if given,
   * then decorate each object with data type.
   */
  doFilter() {
    let query = {}
    this.cv_cfg.searchFields.forEach(field => {
      if (field.value && field.value != "") {
        if (field.asPrefix) {
          query[field.name] = { $like: field.value + "%" }
        } else {
          query[field.name] = field.value
        }
      }
    });
    this.cv_cfg.switches.forEach(sw => {
      if (sw.value) {
        if (sw.trueBefore) {
          query = sw.trueBefore(query)
        }
      } else {
        if (sw.falseBefore) {
          query = sw.falseBefore(query)
        }
      }
    })

    this.dataService.find({ query: query }).then(result => {
      this.cv_cfg.switches.forEach(sw => {
        if (sw.value) {
          if (sw.trueAfter) {
            result.data = sw.trueAfter(result.data)
          }
        } else {
          if (sw.falseAfter) {
            result.data = sw.falseAfter(result.data)
          }
        }
      })

      if (this.cv_cfg.dataType) {
        result.data.forEach(element => {
          element.type = this.cv_cfg.dataType
        });
      }
      this.items = result
    }).catch(err=>{
      if(this.cv_cfg.handleError){
        this.cv_cfg.handleError(err)
      }else{
        alert(err.message)
      }
    })
  }

  select(item) {
    // send event in app
    this.dispatcher.selectItem(item)
    // display selected status in viewer elements
    this.selectedItem=item.id
    this.signaler.signal('selected')
  }

  switchToggle(sw) {
    sw.value = !sw.value
  }
  /*
  getHeight() {
    return "height:" + (window.innerHeight - 100) + "px;overflow:auto"
  }
*/
/**
 * create a new Element
 */
  newElem(){
    this.dataService.create(this.newobj).then(ne=>{
      ne.type=this.cv_cfg.dataType
      this.dispatcher.selectItem(ne)
    })
  }

  drag(event){
    event.dataTransfer.setData("text", event.target.id)
    return true
  }
}

/*
  set item class according to selection Status (needs signal 'selected')
*/
export class selectionClassValueConverter{
  toView(item,sel){
    if(sel == item.id){
      return "highlight"
    }else{
      return "entry"
    }
  }
}
/**
 * Chose image source depending of imgURL attribute and switch value:
 * If imgURL is not given: Just render an empty button.
 * If imgURL has no extension: Append _up.gif or _down.gif according to switch value.
 * If imgURL has given an extension: Display always that image, but render the background red or green according to switch value.
 */
export class imgSrcValueConverter {
  toView(value, sw) {
    let raw = sw.imgURL
    const w = 30
    const h = 30
    if (!raw) {
      raw = "/empty"
    }
    if (raw.includes(".")) {
      const clr = value ? "#BED8A4" : "#A2938F"
      return `background-color:${clr};width:${w}px;height:${h}px;margin-top:4px;margin-left:1px;margin-right:1px`
    } else {
      const frac = value ? "down" : "up"
      return `background-image: url('${raw}_${frac}.gif');width:${w}px;height:${h}px;margin-top:4px;margin-left:1px;margin-right:1px`
    }
  }
}
