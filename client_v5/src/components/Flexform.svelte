<script context="module" lang="ts">
  export interface FlexformConfig {
    title: () => string; // Title for the Form
    colcss?: string; // CSS class for the columns of the form.
    rowcss?: string; // CSS class for the rows of the form.
    compact?: boolean; // If true: Don't display labels for input fields.
    attributes: Array<{
      // Attributes to display in the form
      attribute: string; // Name of the attribue as defined in the datastore backend
      label?: string; // Display-Name for the attribute
      datatype?:
        | string
        | "text"
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
</script>

<script lang="ts">
  import { onMount } from "svelte";
  export let ff_cfg: FlexformConfig;
  export let entity: any;
  export let lockable: boolean = false;
  let isLocked: boolean;
  let isDirty: boolean = false;
  let original: any;

  onMount(() => {
    isLocked = lockable;
  });

  // called whenever a new entity is loaded
  function entityChanged(newvalue, oldvalue) {
    original = Object.assign({}, newvalue);
    isDirty = false;
    isLocked = true;
  }

  function getTitle() {
    if (typeof ff_cfg.title === "string") {
      return ff_cfg.title;
    } else {
      return ff_cfg.title();
    }
  }

  function displayType(attrib) {
    const type = attrib.datatype || "string";
    if (typeof type == "string") {
      if (type == "string") {
        return "line";
      } else if (type == "text") {
        return "field";
      }
    } else if (type.toForm) {
      return "line";
    } else {
      return "list";
    }
  }
  /*
    called befor commiting any changes to the database

  function validate() {
    ff_cfg.attributes.forEach(attr => {
      if (attr.validation) {
        ValidationRules
          .ensure(entity => entity[attr.attribute])
          .displayName(attr.label ? attr.label : attr.attribute)
          .satisfies(attr.validation)
          .withMessage(attr.validationMessage)
      }
    })
  }
*/
  /*
    called after leaving a field. Set dirty flag and give error message
  */
  function validateField(attr) {
    if (entity) {
      // isDirty = !_.isEqual(entity, original);

      if (attr && attr.validation) {
        if (entity[attr.attribute]) {
          if (attr.validation(entity[attr.attribute], entity)) {
            attr.hasErrors = false;
          } else {
            attr.hasErrors = true;
            attr.errmsg = attr.validationMessage;
          }
        }
      }
    }
  }

  /*
    toggle the lock
  */
  function lock() {
    isLocked = !isLocked;
  }

  /*
    save the entiy to the database. Will reject if validaion fails
  */

  function save() {
    /*
    validationController.validate().then((result) => {
      if (result.valid) {
        const dataService = ds.getService(entity.type);
        if (dataService) {
          dataService.update(entity.id, entity);
          dataService.emit("updated", entity);
        }
        isDirty = false;
        original = Object.assign({}, entity);
      }
    });
    */
  }

  /*
    cancel all modifications and restore state after last save
  */
  function undo() {
    entity = Object.assign({}, original);
    isDirty = false;
  }

  function getRowCss() {
    return ff_cfg.rowcss || "form-row";
  }
  function colCss(attr) {
    if (ff_cfg.colcss) {
      return ff_cfg.colcss;
    } else {
      if (attr.sizehint) {
        return "form-group col-" + attr.sizehint;
      } else {
        return "form-group col-6";
      }
    }
  }
</script>

<template>
  {#if lockable}
    <div class="float-right">
      <!-- span class="detailcaption">${ff_cfg.title ? ff_cfg.title() : "Auswahl"}</span -->
      {#if !isLocked}
        <i class="fa fa-lock-open" style="color:red" on:click={lock} />
      {/if}
      {#if isLocked}
        <i class="fa fa-lock" on:click={lock} />
      {/if}
      {#if isDirty}
        <i class="fa fa-save" on:click={save} />
        <i class="fa fa-undo" on:click={undo} />
      {/if}
    </div>
  {/if}
  <form>
    <div>
      {#each ff_cfg.attributes as attr}
        <div class={colCss(attr)}>
          {#if displayType(attr) == "line"}
            <div>
              {#if !ff_cfg.compact}
                <label for={attr.attribute}
                  >{attr.label || attr.attribute}</label
                >
              {/if}
              <input
                type="text"
                class="form-control"
                readonly={isLocked}
                placeholder="${attr.label}"
                id={attr.attribute}
                bind:value={entity[attr.attribute]}
                on:blur={() => validateField(attr)}
              />
              {#if attr.hasErrors}
                <span class="error" style="font-size: small;color:red"
                  >{attr.errmsg}</span
                >
              {/if}
            </div>
          {:else if displayType(attr) == "field"}
            <div>
              {#if !ff_cfg.compact}
                <label for={attr.attribute}>{attr.label}</label>
              {/if}
              <textarea
                id={attr.attribute}
                bind:value={entity[attr.attribute]}
                readonly={isLocked}
                style="width:100%;height:5em;"
                on:blur={() => validateField(attr)}
              />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </form>
</template>
