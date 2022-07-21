<script lang="ts">
  import type { UserType } from "../models/user-model";
  import { userManager, kontaktManager } from "../models";
  import LineInput from "../widgets/LineInput.svelte";
  import KeyValueDisplay from "../widgets/KeyValueDisplay.svelte";
  import { onDestroy } from "svelte";
  import type { KontaktType } from "src/models/kontakt-model";
  export let entity: UserType;
  let mandant: KontaktType;
  userManager.getActiveMandatorFor(entity).then((mnd) => {
    mandant = mnd;
  });
  if (!entity._Kontakt) {
    userManager.getElexisKontakt(entity);
  }
  let dirty = false;
  const keys = [
    "TarmedESRParticipantNumber",
    "TarmedDiagnoseSystem",
    "TarmedErbringungsOrt",
    "ch.elexis.ungrad/qrbills/bank",
    "ch.elexis.ungrad/qrbills/iban",
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
  ];
  function setDirty() {
    dirty = true;
  }
  onDestroy(() => {
    if (dirty) {
      for (const k of mandant.extjson.keys()) {
        if (
          typeof mandant.extjson[k] == "string" &&
          mandant.extjson[k].trim().length == 0
        ) {
          delete mandant.extjson[k];
        }
      }
      kontaktManager.save(mandant);
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
  {#if mandant}
    <p>Mandant: {kontaktManager.getLabel(mandant)}</p>
    {#if mandant.extjson}
      <KeyValueDisplay obj={mandant.extjson} {keys} on:textChanged={setDirty} />
    {/if}
  {/if}
</template>
