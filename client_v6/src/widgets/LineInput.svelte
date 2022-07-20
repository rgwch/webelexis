<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Fa from "svelte-fa";
  const dispatch = createEventDispatcher();
  export let value: string = "";
  export let label: string = "";
  export let placeholder: string = "";
  export let disabled: boolean = false;
  export let buttonIcon = undefined;
  export let buttonText: string = undefined;
  export let id: string = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);
  export let validate: (ins) => boolean = (ins) => true;
  export let errmsg = "Error";
  export let orientation = "vertical";

  let error = false;
  function changed() {
    if (validate) {
      error = !validate(value);
    }
    if (!error) {
      dispatch("textChanged", value);
    }
  }
  function key(event) {
    if (event.code === "Enter") {
      changed();
    }
  }
</script>

<template>
  {#if orientation === "vertical"}
    <div class="formfield flex flex-col">
      {#if label}
        <label for={id} class="text-sm font-bold text-gray-700">{label}</label>
      {/if}
      <div class="relative flex items-stretch flex-grow focus-within:z-10">
        <input
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-200"
          {placeholder}
          bind:value
          on:blur={changed}
          on:keypress={key}
          {id}
          {disabled}
        />
        {#if buttonIcon || buttonText}
          <button
            type="button"
            on:click={changed}
            class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {#if buttonIcon}
              <Fa icon={buttonIcon} />
            {/if}
            {#if buttonText}
              <span>Los</span>
            {/if}
          </button>
        {/if}
      </div>
      {#if error}
        <span class="text-sm font-semibold text-red-500">{errmsg}</span>
      {/if}
    </div>
  {:else if label}
    <div class="flex flex-row">
      <label for={id} class="text-sm font-bold text-gray-700 pr-2">{label}</label>
      <span class="mx-1">:</span>
      <input
        class="pl-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-200"
        {placeholder}
        bind:value
        on:blur={changed}
        on:keypress={key}
        {id}
        {disabled}
      />
    </div>
  {:else}
    <input
      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-200"
      {placeholder}
      bind:value
      on:blur={changed}
      on:keypress={key}
      {id}
      {disabled}
    />
  {/if}
</template>
