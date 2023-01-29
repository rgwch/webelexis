<script lang="ts">
  import type { AUFType } from "src/models/auf-model";
  import { currentPatient } from "../services/store";
  import { aufManager } from "../models";
  import Modal from "../widgets/Modal.svelte";
  import { _ } from "svelte-i18n";
  import DateInput from "../widgets/DateInput.svelte";
  import util from "../services/util";
  import LineInput from "../widgets/LineInput.svelte";

  let aufList: Array<AUFType> = [];
  let showDetail: boolean = false;
  let current: AUFType;

  aufManager.fetchForPatient($currentPatient.id).then((result) => {
    if (result.total && result.data) {
      aufList = (result.data as Array<AUFType>).sort((a, b) => {
        if (!a.datumauz) {
          return 1;
        }
        if (!b.datumauz) {
          return -1;
        }
        return b.datumauz.localeCompare(a.datumauz);
      });
    }
  });
  function detail(auf) {
    current = auf;
    showDetail = true;
  }
</script>

<template>
  {#if $currentPatient}
    <ul>
      {#each aufList as auf}
        <li class="cursor-pointer" on:click={() => detail(auf)}>
          {aufManager.getLabel(auf)}
        </li>
      {/each}
    </ul>
  {/if}
  {#if showDetail}
    <Modal
      title={$_("titles.auflong")}
      on:closed={() => {
        showDetail = false;
      }}
    >
      <div slot="body">
        <div class="flex flex-row">
          <DateInput
            dateString={util.ElexisDateToISODate(current.datumvon)}
            label="von"
          />
          <DateInput
            dateString={util.ElexisDateToISODate(current.datumbis)}
            label="bis"
          />
          <LineInput bind:value={current.prozent} label="Prozent" />
        </div>
        <div class="flex flex-row">
          <LineInput bind:value={current.grund} label="Grund" />
          <LineInput bind:value={current.aufzusatz} label="Bemerkung" />
        </div>
      </div>
    </Modal>
  {/if}
</template>
