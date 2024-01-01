<script lang="ts" context="module">
  export type MenuDef = {
    name: string | Array<MenuDef>;
    label?: string;
    visible?: (item:string)=>boolean
  };
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { slide } from "svelte/transition";
  const dispatch = createEventDispatcher();
  export let title = "";
  export let items: Array<MenuDef> = [];
  export let level = 0;

  let open: boolean = false;
  let parent: Element;

  function submenu(subitems: Array<MenuDef>) {
    const subtitle = subitems.splice(0, 1)[0];
    return { title: subtitle, items: subitems, level: level + 1 };
  }

  function clickListener(event) {
    if (parent != event.target && !parent.contains(event.target)) {
      open = false;
    }
  }
  onMount(() => {
    document.addEventListener("click", clickListener);
  });
  onDestroy(() => {
    document.removeEventListener("click", clickListener);
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->

<div class="relative" bind:this={parent}>
  <div
    class="relative cursor-pointer py-0 my-0 hover:text-blue-600"
    on:click|stopPropagation={() => {
      open = !open;
    }}
  >
    {#if title == ""}
      <svg width="20" height="30">
        <rect y="2" x="3" width="15" height="3" style="fill:rgb(0,0,0)" />
        <rect y="9" x="3" width="15" height="3" style="fill:rgb(0,0,0)" />
        <rect y="16" x="3" width="15" height="3" style="fill:rgb(0,0,0)" />
      </svg>
    {:else}
      {title}
    {/if}
  </div>
  {#if open}
    <div class="bg-green-800 z-100 opacity-100">
      <ul
        class="absolute left-1 top-8 py-0 my-0 border-2 bg-gray-100 list-none"
      >
        {#each items as item}
          {#if Array.isArray(item.name)}
            <li>
              <svelte:self title={item.label} items={item.name} on:selected />
            </li>
          {:else}
            <li
              class="relative w-50 my-0 py-0 hover:text-blue-600 cursor-pointer"
              transition:slide
              on:click={() => {
                dispatch("menuselect", item.name);
                open = false;
              }}
            >
              {item.label || item.name}
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
</div>
