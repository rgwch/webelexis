<script lang="ts">
import { documentManager } from "../models";
import type { DocumentType } from "../models/document-model";
import { currentPatient } from "../services/store";
import cfg from "../services/properties";
import util from "../services/util";

let docs: Array<DocumentType> = [];

currentPatient.subscribe(async (p) => {
  const result = await documentManager.getForPatient(p);
  docs = result;
});
async function show(doc) {
  const contents = await documentManager.fetch(doc.id);
  console.log(contents);
}
</script>

<template>
  {#each docs as doc}
    <p class="py-0 my-0">
      <a href="{cfg.server + '/lucindadoc/' + doc.id}" target="_blank">
        {util.DateObjectToLocalDate(new Date(doc.date))} - {doc.title}
      </a>
    </p>
  {/each}
</template>
