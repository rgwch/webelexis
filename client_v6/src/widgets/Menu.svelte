<script lang="ts">
    import Popup from "./Popup.svelte";
    import { createEventDispatcher } from "svelte";
    import type { MenuDef } from "./Popup.svelte";
    const dispatch = createEventDispatcher();
    export let menudef: Array<MenuDef> = [];
    let hamburgerbtn;
    let expanded = false;
</script>

<div class="fixed z-50 top-0 w-full bg-gray-300 py-1" id="menubar">
    <nav class="flex-row md:justify-between">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
            src="/hamburger.png"
            alt="menu"
            class="md:hidden bg-gray-300"
            bind:this={hamburgerbtn}
            on:click={() => {
                expanded = !expanded;
            }}
        />
        <ul
            class:hidden={!expanded}
            class="flex flex-col md:(flex flex-row px-2 mx-2) cursor-pointer"
        >
            {#each menudef as item}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li
                    class="mr-2 pr-2"
                    on:click={() => dispatch("menuselect", item.name)}
                >
                    {#if typeof item.name == "string"}
                        {item.label}
                    {:else}
                        <Popup
                            items={item.name}
                            title={item.label}
                            on:menuselect
                        />
                    {/if}
                </li>
            {/each}
        </ul>
    </nav>
</div>
