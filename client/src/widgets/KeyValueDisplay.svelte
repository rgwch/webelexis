<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let obj = {};
  export let keys = [];
  let backup = Object.assign({}, obj);

  for (const key of keys) {
    if (!obj[key]) {
      obj[key] = "";
    }
  }
  function checkChange(k: string) {
    if (obj[k] && obj[k].length) {
      if (!backup[k] || backup[k] !== obj[k]) {
        dispatch("textChanged", k);
      }
    } else {
      if (backup[k] && backup[k].length) {
        dispatch("textChanged", k);
      }
    }
  }
</script>

<template>
  <div class="scrollpanel w-full">
    {#if obj}
      <table class="w-full">
        {#each Object.keys(obj) as key}
          {#if typeof obj[key] === "string"}
            <tr>
              <td class="w-min">{key}</td>
              <td>
                <input
                  type="text"
                  class="w-full min-w-18"
                  bind:value={obj[key]}
                  on:blur={() => {
                    checkChange(key);
                  }}
                />
              </td>
            </tr>
          {/if}
        {/each}
      </table>
    {/if}
  </div>
</template>
