<script lang="ts">
import { Billing } from "../services/billing";
import type { BillingsFilter } from "../services/billing";
import type { konsdef } from "../services/billing";
import { Tree } from "../models/tree";
import TreeView from "../widgets/TreeView.svelte";
import { DateTime } from "luxon";
import { CaseManager } from "../models/case-model";
import type { CaseType } from "../models/case-model";
import { EncounterManager, EncounterModel } from "../models/encounter-model";
import SelectOptions from "./SelectOptions.svelte";
import Modal from "./Modal.svelte";
import { _ } from "svelte-i18n";
import "../../node_modules/@fortawesome/fontawesome-free/js/solid";
import "../../node_modules/@fortawesome/fontawesome-free/js/fontawesome";

const cm = new CaseManager();
const em = new EncounterManager();
let patients: Array<Tree<konsdef>> = [];

let tSelected: Array<Tree<konsdef>>=[]
const biller = new Billing();
let selector = false;
let deselector = false;
biller.getBillables().then((result) => {
  patients = result.getChildren();
});
function toggle(t: Tree<konsdef>) {
  t.props.open = !t.props.open;
  patients = patients;
}

async function getFall(t: Tree<konsdef>): Promise<CaseType> {
  if (!t.payload.Fall) {
    t.payload.Fall = await cm.fetch(t.payload.fallid);
  }
  return t.payload.Fall;
}
async function getEncounter(t: Tree<konsdef>): Promise<EncounterModel> {
  if (!t.payload.Konsultation) {
    t.payload.Konsultation = await em.fetch(t.payload.konsid);
  }
  return new EncounterModel(t.payload.Konsultation);
}
let selectOptions: BillingsFilter = { bSelected: true };

function doSelect() {
  const temp = new Tree<konsdef>(null, null);
  if (selectOptions.bName) {
    const regexp = new RegExp(selectOptions.name + ".*", "i");
    for (const node of patients) {
      if (
        node.payload.lastname.match(regexp) ||
        node.payload.firstname.match(regexp)
      ) {
        // new Tree<konsdef>(temp, node.payload);
          temp.acquireTree(node)
      }
    }
  }
  tSelected = temp.getChildren()
}
</script>

<template>
  {#if selector}
    <Modal
      title="{$_('actions.select')}"
      dismiss="{(ok) => {
        selector = false;
        if (ok) {
          doSelect();
        }
      }}">
      <div slot="body"><SelectOptions options="{selectOptions}" /></div>
    </Modal>
  {/if}
  {#if deselector}
    <Modal
      title="{$_('actions.deselect')}"
      dismiss="{(ok) => {
        deselector = false;
        if (ok) {
        }
      }}">
      <div slot="body">deselect</div>
    </Modal>
  {/if}
  <div class="flex flex-row">
    <div class="border-2 border-solid border-blue-400 rounded m-2 flex-1">
      <h2 class="mx-3">
        {$_("titles.unbilled")}<span
          class="ml-4 text-sm cursor-pointer underline hover:text-blue-600 rounded-full"
          on:click="{() => {
            selector = true;
          }}">{$_("actions.select")}</span>
      </h2>
      <ul class="max-h-[80vh] overflow-auto">
        {#each patients as p}
          <li on:click="{() => toggle(p)}" class="cursor-pointer">
            {p.payload.lastname}
            {p.payload.firstname}
            {#if p.props.open}
              <ul>
                {#each p.getChildren() as f, k}
                  <li on:click|stopPropagation="{() => toggle(f)}">
                    {#await getFall(f)}
                      {$_("general.loading")}
                    {:then}
                      {cm.getLabel(f.payload.Fall)}
                    {/await}
                    {#if f.props.open}
                      <ul>
                        {#each f.getChildren() as e}
                          <li>
                            {#await getEncounter(e)}
                              {$_("general.loading")}
                            {:then enc}
                              {#await enc.getLabel()}
                                {$_("general.loading")}
                              {:then label}
                                {label}
                              {/await}
                            {/await}
                          </li>
                        {/each}
                      </ul>
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </div>

    <div class="border-2 border-solid border-blue-400 rounded m-2 flex-1">
      <h2 class="mx-3">
        {$_("titles.selected")}<span
          class="ml-4 text-sm cursor-pointer underline hover:text-blue-600"
          on:click="{() => {
            deselector = true;
          }}">{$_("actions.deselect")}</span>
      </h2>
      
      
        <TreeView trees="{tSelected}" labelProvider="{(n) => n.payload?.lastname+" "+n.payload?.firstname}" />
      
    </div>
    <div class="border-2 border-solid border-blue-400 rounded m-2 flex-1">
      <h2 class="mx-3">{$_("titles.detail")}</h2>
    </div>
  </div>
</template>
