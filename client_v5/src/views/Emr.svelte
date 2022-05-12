<script lang="ts">
import Collapse from "../widgets/Collapse.svelte";
import { _ } from "svelte-i18n";
let persdata: boolean = false;
</script>

<template>
  <Collapse title={$_('titles.personalia')}>
    <div slot="body">Ha!</div>
  </Collapse>
  <Collapse title={$_('titles.medicaments')}>
    <div slot="body">Huch</div>
  </Collapse>
</template>
