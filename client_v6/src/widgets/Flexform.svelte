<script lang="ts" context="module">
  export interface FlexformListRenderer {
    fetchElements: (obj) => Array<any>;
    toString: (line) => string;
  }

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
        | {
            toForm: (obj: any, attr: string) => string;
            toData: (obj: any, attr: string, value: string) => any;
          }
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
</script>

<script lang="ts">
  import { DateTime } from "luxon";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { _ } from "svelte-i18n";
  import Fa from "svelte-fa";
  import {
    faSave,
    faLockOpen,
    faLock,
    faUndo,
  } from "@fortawesome/free-solid-svg-icons";
  import LineInput from "./LineInput.svelte";

  export let ff_cfg: FlexformConfig;
  export let entity: any;
  export let lockable: boolean = false;

  let isLocked: boolean = lockable;
  let isDirty: boolean = false;
  let original: any = Object.assign({}, entity);

  dispatch("lock", "Initialized");

  // called whenever a new entity is loaded
  /*
$: {
  original = Object.assign({}, entity);
  isDirty = false;
  isLocked = true;
}
*/

  function getTitle() {
    if (typeof ff_cfg.title === "string") {
      return ff_cfg.title;
    } else {
      return ff_cfg.title();
    }
  }

  /*
    toggle the lock
  */
  function lock() {
    console.log("Lock called");
    isLocked = !isLocked;
    dispatch("lock", isLocked);
  }

  /**
    save the entiy to the database.
  */
  function save() {
    console.log("flexform save");
    dispatch("save", entity);
    isDirty = false;
    original = Object.assign({}, entity);
  }

  /*
    cancel all modifications and restore state after last save
  */
  function undo() {
    entity = Object.assign({}, original);
    isDirty = false;
  }
  function changed(field, value) {
    isDirty = true;
  }
  function toView(entity, attr): string {
    if (entity && attr) {
      if (attr.datatype == undefined) {
        return attr;
      }
      if (typeof attr.datatype == "string") {
        switch (attr.datatype) {
          case "text":
          case "string":
          case "boolean":
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
  function fromView(entity, attr, value) {
    if (entity && attr) {
      let previous;
      if (typeof attr.datatype == "string") {
        switch (attr.datatype) {
          case "number":
            value = parseFloat(value);
            break;
          case "date":
            if (typeof value == "string") {
              value = DateTime.fromFormat(value, "dd.LL.yyyy").toFormat(
                "yyyyLLdd"
              );
            } else {
              value = DateTime.fromJSDate(value).toFormat("yyyyLLdd");
            }
            break;
        }
        previous = entity[attr.attribute];
        entity[attr.attribute] = value;
        dispatch("changed", { attr, previous, value });
        save();
      } else {
        const func = attr.datatype.toData;
        if (func) {
          func(entity, attr, value);
        }
      }
    }
  }
</script>

<template>
  {#if getTitle()}
    <h2 class="inline-block">{getTitle()}</h2>
  {/if}
  {#if lockable}
    <div class="float-right">
      <div class="inline-block" on:click={lock}>
        <!-- span class="detailcaption">${ff_cfg.title ? ff_cfg.title() : "Auswahl"}</span -->
        {#if !isLocked}
          <Fa icon={faLockOpen} class="text-red-500" on:click={lock} />
        {/if}
        {#if isLocked}
          <Fa icon={faLock} on:click={lock} />
        {/if}
      </div>
      {#if isDirty}
        <div class="mx-2 inline-block" on:click={save}>
          <Fa icon={faSave} />
        </div>
        <div class="mx-2 inline-block" on:click={undo}>
          <Fa icon={faUndo} />
        </div>
      {/if}
    </div>
  {/if}
  {#if entity}
    <form>
      <div class="grid grid-cols-1 gap-2 md:grid-cols-9">
        {#each ff_cfg.attributes as attr}
          <div class={attr.css}>
            {#if attr.datatype == "readonly"}
              <span>{attr.label}: {entity[attr.attribute]}</span>
            {:else if attr.datatype == "boolean"}
              <div class="flex flex-row">
                <input
                  type="checkbox"
                  value={toView(entity, attr)}
                  on:select={(event) => {
                    console.log(JSON.stringify(event));
                    fromView(entity, attr, event);
                  }}
                />
                <span>{attr.label}</span>
              </div>
            {:else}
              <LineInput
                value={toView(entity, attr)}
                label={attr.label}
                disabled={isLocked}
                on:textChanged={(event) => {
                  console.log(JSON.stringify(event));
                  fromView(entity, attr, event.detail);
                }}
              />
            {/if}
          </div>
        {/each}
      </div>
    </form>
  {/if}
</template>
