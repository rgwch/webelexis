<script lang="ts">
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
export let label: string = undefined;
export let elements: Array<string> = [];
export let selected = elements[0];

let open = false;
</script>

<template>
  <div>
    {#if label}
      <label
        for="listbox"
        id="listbox-label"
        class="block text-sm font-medium text-gray-700">
        {label}
      </label>
    {/if}
    <div class="mt-1 relative" id="listbox">
      <button
        on:click="{() => {
          open = !open;
        }}"
        type="button"
        class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label">
        <span class="block truncate">{selected}</span>
        <span
          class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <!-- Heroicon name: solid/selector -->
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
        </span>
      </button>

      <!--
      Select popover, show/hide based on select state.

      Entering: ""
        From: ""
        To: ""
      Leaving: "transition ease-in duration-100"
        From: "opacity-100"
        To: "opacity-0"
    -->
      {#if open}
        <ul
          class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3">
          <!--
        Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

        Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
      -->
          {#each elements as element, idx}
            <li
              on:click="{() => {
                selected = element;
                open = false;
                dispatch('selected', element);
              }}"
              class="text-gray-900 hover:(text-white bg-indigo-600) cursor-default select-none relative py-2 pl-8 pr-4"
              id="{'listbox' + idx}"
              role="option">
              <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
              <span
                class="block truncate"
                class:font-semibold="{selected == element}">{element}</span>

              <!--
          Checkmark, only display for selected option.

          Highlighted: "text-white", Not Highlighted: "text-indigo-600"
        -->
              {#if element === selected}
                <span
                  class="text-indigo-600 absolute inset-y-0 left-0 flex items-center pl-1.5">
                  <!-- Heroicon name: solid/check -->
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
                  </svg>
                </span>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</template>
