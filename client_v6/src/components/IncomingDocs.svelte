<script lang="ts">
  import { documentManager } from "../models";
  import type { DocumentType } from "../models/document-model";
  import { currentPatient } from "../services/store";
  import cfg from "../services/properties";
  import util from "../services/util";

  let docs: Array<DocumentType> = [];
  let datePattern = /([0-9]{2,2})\.([0-9]{2,2})\.([0-9]{4,4})/;

  function normalize(document) {
    let t: string = document.title.toLocaleLowerCase();
    const hit = datePattern.exec(t);
    if (hit) {
      t = hit[3] + hit[2] + hit[1] + t.substring(10);
    }
    return t;
  }
  currentPatient.subscribe(async (p) => {
    const result = await documentManager.getForPatient(p);
    docs = result.sort((d, e) => normalize(e).localeCompare(normalize(d)));
  });
  async function show(doc) {
    const contents = await documentManager.fetch(doc.id);
    console.log(contents);
  }
</script>

<template>
  {#each docs as doc}
    <p class="py-0 my-0">
      <a
        href={window.location.origin + "/lucindadoc/" + doc.id}
        target="_blank"
      >
        {doc.title}
      </a>
      ({util.DateObjectToLocalDate(new Date(doc.date))})
    </p>
  {/each}
</template>
