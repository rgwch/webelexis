/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { bindable, computedFrom, valueConverter, inject, NewInstance, LogManager } from 'aurelia-framework'
import { ValidationController, ValidationRules } from 'aurelia-validation'
import * as _ from 'lodash/core'

const log=LogManager.getLogger("FlexForm")

/**
 * FlexForm: Counterpart for the CommonViewer: Generic Detail-Display. 
 * Usage: Define a FlexFormConfig and bind it
 * as 'ff_cfg' to the flex-form custom element. Bind the Object to display as 'entity' to the flex-form.
 */
export interface FlexformConfig {
  title: () => string     // Title for the Form
  colcss?: string       // CSS class for the columns of the form. Defaults to "form-group col-6"
  rowcss?: string       // CSS class for the rows of the form. Defaults to "form-row"
  compact?: boolean     // If true: Don't display labels for input fields.
  attributes: Array<{   // Attributes to display in the form
    attribute: string   // Name of the attribue as defined in the datastore backend
    label?: string      // Display-Name for the attribute
    datatype?: string | "text" | { toForm: (x: any) => string, toData: (x: string) => any } | FlexformListRenderer
    // type of the data. Either "string" or an object containing a function to
    // render the data and a function to store the data.
    validation?: (value, entity) => boolean
    // validation if given: A function that returns false, if the entry is invalid.
    validationMessage?: string
    // a message to display, if validation failed.
    sizehint?: string | number
    // Either a number 1-12 for the number of columns (1/12 to 12/12) or a string with css class(es).
  }>
}

export interface FlexformListRenderer {
  fetchElements: (obj) => Array<any>
  toString: (line) => string
}

@inject(NewInstance.of(ValidationController))
export class FlexForm {
  @bindable ff_cfg: FlexformConfig
  @bindable entity: any;
  @bindable lockable: boolean
  isLocked: boolean
  isDirty: boolean = false
  private original: any
  private ds

  constructor(private validationController: ValidationController) { }

  attached() {
    this.isLocked = this.lockable
    log.debug("attached")
  }

  // called whenever a new entity is loaded
  entityChanged(newvalue, oldvalue) {
    this.original = this.original = Object.assign({}, newvalue)
    this.isDirty = false
    this.isLocked = true
    log.debug("Entity changed from "+(oldvalue ? oldvalue.id : "empty")+" to "+(newvalue ? newvalue.id : "empty"))
  }

  @computedFrom('entity')
  get title() {
    if (typeof (this.ff_cfg.title) === 'string') {
      return this.ff_cfg.title
    } else {
      return this.ff_cfg.title()
    }
  }

  displayType(attrib) {
    const type = attrib.datatype || 'string'
    if (typeof (type) == 'string') {
      if (type == "string") {
        return "line"
      } else if (type == "text") {
        return "field"
      }
    } else if (type.toForm) {
      return "line"
    } else {
      return "list"
    }
  }
  /*
    called befor commiting any changes to the database
  */
  validate() {
    this.ff_cfg.attributes.forEach(attr => {
      if (attr.validation) {
        ValidationRules
          .ensure(entity => entity[attr.attribute])
          .displayName(attr.label ? attr.label : attr.attribute)
          .satisfies(attr.validation)
          .withMessage(attr.validationMessage)
      }
    })
  }

  /*
    called after leaving a field. Set dirty flag and give error message
  */
  validateField(attr) {
    if (this.entity) {
      this.isDirty = !_.isEqual(this.entity, this.original)

      if (attr && attr.validation) {
        if (this.entity[attr.attribute]) {
          if (attr.validation(this.entity[attr.attribute], this.entity)) {
            attr.hasErrors = false
          } else {
            attr.hasErrors = true
            attr.errmsg = attr.validationMessage
          }
        }
      }
    }
  }

  /*
    toggle the lock
  */
  lock() {
    this.isLocked = !this.isLocked
  }

  /*
    save the entiy to the database. Will reject if validaion fails
  */
  save() {
    this.validationController.validate().then(result => {
      if (result.valid) {
        const dataService = this.ds.getService(this.entity.type)
        if (dataService) {
          dataService.update(this.entity.id, this.entity)
          dataService.emit("updated", this.entity)
        }
        this.isDirty = false
        this.original = Object.assign({}, this.entity)

      }
    })
  }

  /*
    cancel all modifications and restore state after last save
  */
  undo() {
    this.entity = Object.assign({}, this.original)
    this.isDirty = false
  }

  @computedFrom('cfg')
  get rowCss() {
    return this.ff_cfg.rowcss || "form-row"
  }
  colCss(attr) {
    if (this.ff_cfg.colcss) {
      return this.ff_cfg.colcss
    } else {
      if (attr.sizehint) {
        return "form-group col-" + attr.sizehint
      } else {
        return "form-group col-6"
      }
    }
  }
}

/**
 * convert values from the model to the view and vice versa
 */
@valueConverter('flexformvalues')
export class FlexFormValueConverter {
  toView(value, attr) {
    if (value && attr) {
      if (attr.datatype == undefined) {
        return value
      }
      if (typeof attr.datatype == 'string') {
        switch (attr.datatype) {
          case "text":
          case "string": return value
          case "number": return value.toString()
        }
      } else {
        const func = attr.datatype.toForm
        if (func) {
          return func(value)
        } else {
          return value
        }
      }
    } else {
      return ""
    }
  }
  fromView(value, attr) {
    if (value && attr) {
      if (attr.datatype == undefined) {
        return value
      }
      if (typeof attr.datatype == 'string') {
        switch (attr.datatype) {
          case "text":
          case "string": return value
          case "number": return parseFloat(value)
        }
      } else {
        const func = attr.datatype.toData
        if (func) {
          return func(value)
        } else {
          return value
        }
      }
    }
  }
}

/**
 * Decide wether to show the open or locked state
 */
export class unlockableValueConverter {
  toView(val, locked) {
    if (val) {
      return locked
    } else {
      return false
    }
  }
}


