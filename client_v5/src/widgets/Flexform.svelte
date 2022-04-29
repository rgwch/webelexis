<script lang="ts">
import { onMount } from "svelte";
import type { FlexformConfig } from "./flexformtypes";
import { FlexFormValueConverter } from "./flexformtypes";
import LineInput from "./LineInput.svelte";
import TextInput from "./TextInput.svelte";
import DateInput from "./DateInput.svelte";
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
        <i class="fa fa-lock-open" style="color:red" on:click="{lock}"></i>
      {/if}
      {#if isLocked}
        <i class="fa fa-lock" on:click="{lock}"></i>
      {/if}
      {#if isDirty}
        <i class="fa fa-save" on:click="{save}"></i>
        <i class="fa fa-undo" on:click="{undo}"></i>
      {/if}
    </div>
  {/if}
  <form>
    <div>
      {#each ff_cfg.attributes as attr}
        <div>
          {#if attr.datatype == "string"}
            <LineInput
              bind:value="{entity[attr.attribute]}"
              label="{attr.label}"
            />
          {:else if attr.datatype == "date"}
            <DateInput
              dateString="{entity[attr.attribute]}"
              label="{attr.label}"
            />
          {:else if attr.datatype == "number"}
            <LineInput
              bind:value="{attr.attribute}"
              label="{attr.label}"
              validate="{(n) => !isNaN(n)}"
              errmsg="numbers only"
            />
          {:else if attr.datatype == "text"}
            {#if !ff_cfg.compact}
              <label for="{attr.attribute}">{attr.label}</label>
            {/if}
            <TextInput
              id="{attr.attribute}"
              value="{entity[attr.attribute]}"
              readonly="{isLocked}"
            />
          {/if}
        </div>
      {/each}
    </div>
  </form>
</template>
