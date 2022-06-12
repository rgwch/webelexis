<script lang="ts">
import type { BriefType } from "../models/briefe-model";
import { briefManager, kontaktManager } from "../models";
import util from "../services/util";
import cfg from "../services/properties";

import { currentPatient } from "../services/store";
import type { KontaktType } from "../models/kontakt-model";
let docs: Array<BriefType> = [];
let adressees: Array<string> = [];

currentPatient.subscribe((np) => {
  fetchDocuments();
});

async function fetchDocuments() {
  const result = await briefManager.find({
    query: { patientid: $currentPatient?.id, $sort: { datum: "desc" } },
  });
  docs = result.data;
}
async function getAdressee(idx: number) {
  if (adressees[idx]) {
    return adressees[idx];
  } else {
    const adressee: KontaktType = (await kontaktManager.fetch(
      docs[idx].destid
    )) as KontaktType;
    adressees[idx] = kontaktManager.getLabel(adressee);
    return adressees[idx];
  }
}
async function show(brief: BriefType) {
  if (brief.path) {
    const hydrated = (await briefManager.fetch(brief.id)) as BriefType;
    if (hydrated.contents) {
      const win = window.open("", "_new");
      if (!win) {
        alert(
          "Bitte stellen Sie sicher, dass dieses Programm Popups öffnen darf"
        );
      } else {
        win.document.write(hydrated.contents);
        // Allow freshly opened window to load css and render
        setTimeout(() => {}, 50);
      }
    }
  }
}
</script>

<template>
  <div class="scrollpanel">
    {#each docs as doc, idx}
      <p class="py-0 my-0 cursor-pointer hover:text-blue-500">
        <a href="{cfg.server + '/outgoing/' + doc.id}">
          {util.ElexisDateToLocalDate(doc.datum)} - {doc.betreff}
        </a>
        {#await getAdressee(idx) then adr}
          - {adr}
        {/await}
        - ({doc.mimetype})
      </p>
    {/each}
  </div>
</template>
