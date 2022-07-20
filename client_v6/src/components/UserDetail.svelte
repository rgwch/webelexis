<script lang="ts">
  import type { UserType } from "../models/user-model";
  import { userManager, kontaktManager } from "../models";
  import LineInput from "../widgets/LineInput.svelte";
  import KeyValueDisplay from "../widgets/KeyValueDisplay.svelte";
  import { onDestroy } from "svelte";
  export let entity: UserType;
  if (!entity._Kontakt) {
    userManager.getElexisKontakt(entity);
  }
  let dirty = false;
  const keys = [
    "TarmedESRParticipantNumber",
    "TarmedDiagnoseSystem",
    "TarmedErbringungsOrt",
    "ch.elexis.ungrad/rbills/bank	",
    "TarmedSpezialität",
    "TarmedESRPlus",
    "Rolle",
    "TarmedESRIdentity",
    "TarmedTiersGarantOrPayant",
    "TarmedESR5OrEsr9",
    "TarmedRnBank",
    "Kanton",
    "ch.elexis.data.tarmed.mandant.type",
    "TarmedKanton",
    "ch.elexis.ungrad/rbills/iban",
  ];
  function setDirty() {
    dirty = true;
  }
  onDestroy(() => {
    if (dirty) {
      kontaktManager.save(entity._Kontakt);
    }
  });
</script>

<template>
  <div class="flex p-4 mx-2">
    <LineInput
      disabled={true}
      value={entity.id}
      label="Username"
      on:textChanged={setDirty}
    />
    <LineInput
      value={entity._Kontakt?.bezeichnung1}
      disabled={true}
      label="Lastname"
      on:textChanged={setDirty}
    />
    <LineInput
      value={entity._Kontakt?.bezeichnung2}
      disabled={true}
      label="firstname"
    />
  </div>
  <KeyValueDisplay
    obj={entity._Kontakt?.extjson}
    {keys}
    on:textChanged={setDirty}
  />
</template>
