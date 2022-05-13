<script lang="ts">
import Collapse from "../widgets/Collapse.svelte";
import { _ } from "svelte-i18n";
let persdata=false;
let medicaments=false
</script>

<template>
  <Collapse title={$_('titles.personalia')} bind:open={persdata}>
    <div slot="body">Ha!</div>
  </Collapse>
  <Collapse title={$_('titles.medicaments')} bind:open={medicaments}>
    <div slot="body">No contents yet</div>
  </Collapse>
</template>
