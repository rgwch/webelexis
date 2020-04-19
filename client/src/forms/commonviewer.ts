/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, bindable } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { ObjectManager } from './../models/object-manager';
import { BindingSignaler } from "aurelia-templating-resources";
import { FlexformConfig } from "./flexform";
import { IElexisType } from "models/elexistype";
import './commonviewer.scss'

/***
  CommonViewer: Loosely adapted from the Elexis class with the same name: A component to uniformely
  retrieve, filter and display a list of objects of a subtype of "Service".
  First, create a ViewerConfiguration with the desired parameters, then create a CommonViewer
  and transmit the ViewerConfiguration via Aurelia-template binding.
  If the ViewerConfiguration contains a createDef, the Viewer will present a
  "New Item" button to display a Dialog box to create a new Object of its type.
  If the user selects an Element in the list, an event is sent, depending on the
  'selectMsg' setting.
  */

export interface IViewerConfiguration {
  // datatype to handle. Name must match the according DataService
  dataType: string;
  // Title of the View
  title: string;

  selectMsg?: string; // undefined for a WebelexisEvent, or a message for the EventAggregator

  // filter fields to create at the top of the viewer
  searchFields: Array<{
    name: string; // name of field in the storage
    label: string; // display of the field in the UI
    asPrefix?: boolean; // if true, add a '%' to the contents
    value?: string; // receives user input
  }>;
  // optional array of switches to add to the filters
  switches?: Array<{
    label: string; // tooltip of the switch
    imgURL?: string; // URL of an image for the switch
    falseBefore?: (query: any) => any; // functions to modify query before sending (if the switch is unset,
    trueBefore?: (query: any) => any;  // "falseBefore" will be called, otherwise "trueBefore")
    falseAfter?: (result: any) => any; // functions to modify the result after receiving. Similar to xxxxBefore
    trueAfter?: (result: any) => any;
    value?: boolean; // initial value of the switch
  }>;
  // function to create a label for each object of the list
  getLabel: (obj) => string;
  // Show "new object" Button and create Dialog with FlexFormConfig if pushed
  createDef?: FlexformConfig;
  handleError?: (err) => void;
}

@autoinject
export class CommonViewer {
  @bindable
  public cv_cfg: IViewerConfiguration;
  public items;
  public selectedItem: string = ""; // referenced in view
  private newobj: IElexisType = {};
  private objectManager: ObjectManager

  constructor(
    private ea: EventAggregator,
    private signaler: BindingSignaler
  ) { }

  do_reload = msg => this.doFilter();

  public attached() {
    if (!this.cv_cfg.switches) {
      this.cv_cfg.switches = [];
    }

    this.objectManager = new ObjectManager(this.cv_cfg.dataType)
    // this.dataService = this.dataSource.getService(this.cv_cfg.dataType);

    // react on updated elements
    this.objectManager.on("updated", this.do_reload);
    // react on new elements
    this.objectManager.on("created", this.do_reload);
  }



  public detached() {
    this.objectManager.off("updated", this.do_reload);
    this.objectManager.off("created", this.do_reload);
  }
  /**
   * reload list. First, apply searchFields, second apply "before" switch functions if given
   * Then send feathers.find(). On the ruslt, apply "after" switch functions, if given,
   * then decorate each object with data type.
   */
  public doFilter() {
    let query = {};
    this.cv_cfg.searchFields.forEach(field => {
      if (field.value && field.value !== "") {
        if (field.asPrefix) {
          query[field.name] = { $like: field.value + "%" };
        } else {
          query[field.name] = field.value;
        }
      }
    });
    this.cv_cfg.switches.forEach(sw => {
      if (sw.value) {
        if (sw.trueBefore) {
          query = sw.trueBefore(query);
        }
      } else {
        if (sw.falseBefore) {
          query = sw.falseBefore(query);
        }
      }
    });

    this.objectManager
      .find(query)
      .then(result => {
        this.cv_cfg.switches.forEach(sw => {
          if (sw.value) {
            if (sw.trueAfter) {
              result.data = sw.trueAfter(result.data);
            }
          } else {
            if (sw.falseAfter) {
              result.data = sw.falseAfter(result.data);
            }
          }
        });

        if (this.cv_cfg.dataType) {
          result.data.forEach(element => {
            element.type = this.cv_cfg.dataType;
          });
        }
        this.items = result;
      })
      .catch(err => {
        if (this.cv_cfg.handleError) {
          this.cv_cfg.handleError(err);
        } else {
          alert(err.message);
        }
      });
  }

  /**
   * The user selected an item. If vc_cvg.selectMsg is set, let the EventAggregator publish
   * an event with that name. If not, send a WebelexisEvent for the newly selected item
   * (i.e: Select globally).
   * @param item the object the user selected.
   */
  public select(item) {
    // send event in app
    if (this.cv_cfg.selectMsg) {
      this.ea.publish(this.cv_cfg.selectMsg, item);
    } else {
      // this.dispatcher.selectItem(item);
    }
    // display selected status in viewer elements
    this.selectedItem = item.id;
    this.signaler.signal("selected");
  }

  public switchToggle(sw) {
    sw.value = !sw.value;
  }
  /*
  getHeight() {
    return "height:" + (window.innerHeight - 100) + "px;overflow:auto"
  }
*/
  /**
   * create a new Element
   */
  public newElem() {
    this.newobj.type = this.cv_cfg.dataType;
    this.objectManager.save(this.newobj).then((ne: IElexisType) => {
      ne.type = this.cv_cfg.dataType;
      // this.dispatcher.selectItem(ne);
    });
  }

  public drag(event) {
    const obj = this.items.data.find(el => event.target.id.endsWith(el.id));
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.setData("webelexis/object", JSON.stringify(obj));
    event.dataTransfer.setData("webelexis/datatype", this.cv_cfg.dataType);
    return true;
  }
}

/*
  set item class according to selection Status (needs signal 'selected')
*/
export class SelectionClassValueConverter {
  public toView(item, sel) {
    if (sel === item.id) {
      return "highlight";
    } else {
      return "entry";
    }
  }
}
/**
 * Chose image source depending of imgURL attribute and switch value:
 * If imgURL is not given: Just render an empty button.
 * If imgURL has no extension: Append _up.gif or _down.gif according to switch value.
 * If imgURL has given an extension: Display always that image, but render 
 * the background red or green according to switch value.
 */
export class imgSrcValueConverter {
  public toView(value, sw) {
    let raw = sw.imgURL;
    const w = 30;
    const h = 30;
    if (!raw) {
      raw = "/empty";
    }
    if (raw.includes(".")) {
      const clr = value ? "#BED8A4" : "#A2938F";
      return `background-color:${clr};width:${w}px;height:${h}px;margin-top:4px;margin-left:1px;margin-right:1px`;
    } else {
      const frac = value ? "down" : "up";
      return `background-image: url('${raw}_${frac}.gif');width:${w}px;height:${h}px;margin-top:4px;margin-left:1px;margin-right:1px`;
    }
  }
}
