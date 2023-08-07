<!-- A Simple Tab Panel -->
<script lang="ts" context="module">
  type tabdef = {
    name: string; // Title to show
    content: any; // Component to display
    display: boolean; // False: Don't display
  };
</script>

<script lang="ts">
  export let tabs: Array<tabdef>;
  export let activeTab = 0;
</script>

{#each tabs as tab, idx}
  {#if tab.display}
    <button
      class="tab"
      class:active={idx === activeTab}
      on:click={() => {
        activeTab = idx;
      }}
    >
      {tab.name}
    </button>
  {/if}
{/each}
{#each tabs as tab, idx}
  {#if idx === activeTab}
    <svelte:component this={tab.content} />
  {/if}
{/each}

<style>
  .tab {
    margin-right: 4px;
    padding-left: 2px;
  }
  .tab.active {
    border-bottom: 1px solid blue;
  }
</style>
