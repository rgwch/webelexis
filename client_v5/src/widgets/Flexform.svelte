<script lang="ts">
import type { FlexformConfig } from "./flexformtypes";
import { FlexFormValueConverter } from "./flexformtypes";
import Fa from "svelte-fa";
import {
  faSave,
  faLockOpen,
  faLock,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import LineInput from "./LineInput.svelte";
import TextInput from "./TextInput.svelte";
import DateInput from "./DateInput.svelte";
export let ff_cfg: FlexformConfig;
export let entity: any;
export let lockable: boolean = true;
let isLocked: boolean = lockable;
let isDirty: boolean = false;
let original: any = Object.assign({}, entity);

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
function changed(field, value) {
  isDirty = true;
}
</script>

<template>
  {#if lockable}
    <div class="float-right" on:click="{lock}">
      <!-- span class="detailcaption">${ff_cfg.title ? ff_cfg.title() : "Auswahl"}</span -->
      {#if !isLocked}
        <Fa icon="{faLockOpen}" class="text-red-500" on:click="{lock}" />
      {/if}
      {#if isLocked}
        <Fa icon="{faLock}" on:click="{lock}" />
      {/if}
      {#if isDirty}
        <Fa icon="{faSave}" on:click="{save}" />
        <Fa icon="{faUndo}" on:click="{undo}" />
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
              disabled="{isLocked}"
              on:textChanged="{(value) => changed(attr.attribute, value)}"
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
