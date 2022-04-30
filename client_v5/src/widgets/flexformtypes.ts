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
    | { toForm: (x: any) => string; toData: (x: string) => any }
    | FlexformListRenderer;
    // type of the data. Either "string" or an object containing a function to
    // render the data and a function to store the data.
    validation?: (value, entity) => boolean;
    // validation if given: A function that returns false, if the entry is invalid.
    validationMessage?: string;
    // a message to display, if validation failed.
    sizehint?: string | number;
    // Either a number 1-12 for the number of columns (1/12 to 12/12) or a string with css class(es).
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
  toView(value, attr) {
    if (value && attr) {
      if (attr.datatype == undefined) {
        return value;
      }
      if (typeof attr.datatype == "string") {
        switch (attr.datatype) {
          case "text":
          case "string":
            return value;
          case "number":
            return value.toString();
          case "date":
            return DateTime.fromISO(value).toLocaleString();
        }
      } else {
        const func = attr.datatype.toForm;
        if (func) {
          return func(value);
        } else {
          return value;
        }
      }
    } else {
      return "";
    }
  }
  fromView(value, attr) {
    if (value && attr) {
      if (attr.datatype == undefined) {
        return value;
      }
      if (typeof attr.datatype == "string") {
        switch (attr.datatype) {
          case "text":
          case "string":
            return value;
          case "number":
            return parseFloat(value);
          case "date":
            return DateTime.fromFormat(value, "DD");
        }
      } else {
        const func = attr.datatype.toData;
        if (func) {
          return func(value);
        } else {
          return value;
        }
      }
    }
  }
}
