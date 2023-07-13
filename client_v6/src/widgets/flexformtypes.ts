import { DateTime } from "luxon";
export interface FlexformConfig {
  title: string | (() => string); // Title for the Form
  compact?: boolean; // If true: Don't display labels for input fields.
  attributes: Array<{
    // Attributes to display in the form
    attribute: string; // Name of the attribue as defined in the datastore backend
    label?: string; // Display-Name for the attribute
    datatype?:
    | "date"
    | "string"
    | "text"
    | "number"
    | "boolean"
    | "readonly"
    | { toForm: (obj: any, attr: string) => string; toData: (obj: any, attr: string, value: string) => any }
    | FlexformListRenderer;
    // type of the data. Either "string" or an object containing a function to
    // render the data and a function to store the data.
    validation?: (value, entity) => boolean;
    // validation if given: A function that returns false, if the entry is invalid.
    validationMessage?: string;
    // a message to display, if validation failed.
    css?: string;
    // class/es to apply to the field. i.e. "col-span-4 bg-blue" 
    hasErrors?: boolean;
    errmsg?: string;
  }>;
}
export interface FlexformListRenderer {
  fetchElements: (obj) => Array<any>;
  toString: (line) => string;
}

/**
 * Decide wether to show the open or locked state
 */
export class unlockableValueConverter {
  toView(val, locked) {
    if (val) {
      return locked;
    } else {
      return false;
    }
  }
}
/**
 * convert values from the model to the view and vice versa
 */
export class FlexFormValueConverter {
  toView(entity, attr): string {
    if (entity && attr) {
      if (attr.datatype == undefined) {
        return attr;
      }
      if (typeof attr.datatype == "string") {
        switch (attr.datatype) {
          case "text":
          case "string":
            return entity[attr.attribute];
          case "number":
            return entity[attr.attribute].toString();
          case "date":
            return DateTime.fromISO(entity[attr.attribute]).toLocaleString();
        }
      } else {
        const func = attr.datatype.toForm;
        if (func) {
          return func(entity, attr);
        } else {
          return attr;
        }
      }
    } else {
      return "";
    }
  }
  fromView(entity, attr, value) {
    if (entity && attr) {
      if (typeof attr.datatype == "string") {
        switch (attr.datatype) {
          case "number":
            value = parseFloat(value);
            break;
          case "date":
            value = DateTime.fromFormat(value, "DD");
            break;
        }
        entity[attr.attribute] = value;
      } else {
        const func = attr.datatype.toData;
        if (func) {
          func(entity, attr, value);
        }
      }
    }
  }
}
