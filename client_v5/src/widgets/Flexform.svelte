<script lang="ts">
  import { onMount } from "svelte";
  import type { FlexformConfig } from "./flexformtypes";
  import { FlexFormValueConverter } from "./flexformtypes";
  import LineInput from "./LineInput.svelte";
  export let ff_cfg: FlexformConfig;
  export let entity: any;
  export let lockable: boolean = false;
  let isLocked: boolean;
  let isDirty: boolean = false;
  let original: any;
  const converter = new FlexFormValueConverter();

  onMount(() => {
    isLocked = lockable;
  });

  // called whenever a new entity is loaded
  $: {
    original = Object.assign({}, entity);
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
    called before commiting any changes to the database

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
    save the entiy to the database. Will reject if validation fails
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
        <div>
          {#if displayType(attr) == "line"}
            <LineInput bind:value={entity.attribute} label={attr.label} />
            <!-- div >
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
            </div -->
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
