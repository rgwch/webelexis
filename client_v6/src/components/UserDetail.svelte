<script lang="ts">
  import type { UserType } from "../models/user-model";
  import { userManager } from "../models";
  import LineInput from "../widgets/LineInput.svelte";
  import KeyValueDisplay from "../widgets/KeyValueDisplay.svelte";
  export let entity: UserType;
  if (!entity._Kontakt) {
    userManager.getElexisKontakt(entity);
  }
</script>

<template>
  <div class="flex p-4 mx-2">
    <LineInput disabled={true} value={entity.id} label="Username" />
    <LineInput
      value={entity._Kontakt?.bezeichnung1}
      disabled={true}
      label="Lastname"
    />
    <LineInput
      value={entity._Kontakt?.bezeichnung2}
      disabled={true}
      label="firstname"
    />
  </div>
  <KeyValueDisplay obj={entity._Kontakt?.extjson} />
</template>
