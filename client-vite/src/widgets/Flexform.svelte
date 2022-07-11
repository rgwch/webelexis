<script lang="ts">
import type { FlexformConfig } from "./flexformtypes";
import { FlexFormValueConverter } from "./flexformtypes";
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
import TextInput from "./TextInput.svelte";
import DateInput from "./DateInput.svelte";
import { attr, attribute_to_object } from "svelte/internal";

export let ff_cfg: FlexformConfig;
export let entity: any;
export let lockable: boolean = false;

let isLocked: boolean = lockable;
let isDirty: boolean = false;
let original: any = Object.assign({}, entity);

dispatch("lock", "Initialized");

/*
// called whenever a new entity is loaded
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
</script>

<template>
  {#if getTitle()}
    <h2 class="inline-block">{getTitle()}</h2>
  {/if}
  {#if lockable}
    <div class="float-right">
      <div class="inline-block" on:click="{lock}">
        <!-- span class="detailcaption">${ff_cfg.title ? ff_cfg.title() : "Auswahl"}</span -->
        {#if !isLocked}
          <Fa icon="{faLockOpen}" class="text-red-500" on:click="{lock}" />
        {/if}
        {#if isLocked}
          <Fa icon="{faLock}" on:click="{lock}" />
        {/if}
      </div>
      {#if isDirty}
        <div class="mx-2 inline-block" on:click="{save}">
          <Fa icon="{faSave}" />
        </div>
        <div class="mx-2 inline-block" on:click="{undo}">
          <Fa icon="{faUndo}" />
        </div>
      {/if}
    </div>
  {/if}
  {#if entity}
    <form>
      <div>
        {#each ff_cfg.attributes as attr}
          <div>
            {#if attr.datatype == "string"}
              <LineInput
                bind:value="{entity[attr.attribute]}"
                label="{attr.label}"
                disabled="{isLocked}"
                on:textChanged="{(value) => changed(attr.attribute, value)}" />
            {:else if attr.datatype == "date"}
              <DateInput
                bind:dateString="{entity[attr.attribute]}"
                label="{attr.label}"
                disabled="{isLocked}"
                on:dateChanged="{(value) => {
                  changed(attr.attribute, value);
                }}" />
            {:else if attr.datatype == "number"}
              <LineInput
                bind:value="{entity[attr.attribute]}"
                label="{attr.label}"
                disabled="{isLocked}"
                validate="{(n) => !isNaN(n)}"
                errmsg="{$_('validation.onlyNumbers')}" />
            {:else if attr.datatype == "text"}
              {#if !ff_cfg.compact}
                <label for="{attr.attribute}">{attr.label}</label>
              {/if}
              <TextInput
                id="{attr.attribute}"
                bind:value="{entity[attr.attribute]}"
                on:textChanged="{(value) => changed(attr.attribute, value)}"
                readonly="{isLocked}" />
            {:else if attr.datatype == "readonly"}
              <span>{attr.label}: {entity[attr.attribute]}</span>
            {/if}
          </div>
        {/each}
      </div>
    </form>
  {/if}
</template>
