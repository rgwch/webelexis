<script lang="ts">
import type { BriefType } from "../models/briefe-model";
import { briefManager } from "../models";
import util from '../services/util'

import { currentPatient } from "../services/store";
let docs: Array<BriefType> = [];

currentPatient.subscribe((np) => {
  fetchDocuments()
});

async function fetchDocuments() {
  const result = await briefManager.find({
    query: { patientid: $currentPatient?.id, $sort:{datum: "desc"} },
  });
  docs = result.data as Array<BriefType>;
}
async function show(brief:BriefType){
  if(brief.path){
    const hydrated=await briefManager.fetch(brief.id) as BriefType
    if(hydrated.contents){
      const win = window.open("", "_new");
    if (!win) {
      alert(
        "Bitte stellen Sie sicher, dass dieses Programm Popups öffnen darf"
      );
    } else {
      win.document.write(hydrated.contents);
      // Allow freshly opened window to load css and render
      setTimeout(() => {
      }, 50);
    }
    }
  }
}
</script>

<template>
  <div class="scrollpanel">
    {#each docs as doc}
      <p class="py-0 my-0 cursor-pointer hover:text-blue-500" on:click={()=>show(doc)}>{util.ElexisDateToLocalDate(doc.datum)} - {doc.betreff} </p>
    {/each}
  </div>
</template>
