<script lang="ts">
import { EncounterModel, type EncounterType } from "../models/encounter-model";
import {weekDaysShort} from '../models/timedate'
import {DateTime} from 'luxon'
import type {CaseType} from '../models/case-model'
import {UserManager} from '../models/user-model'
import Editor from '../widgets/Editor.svelte'
import {Macros} from '../services/macros'
import { _ } from "svelte-i18n";
import type { Money } from "../models/money";
import type { ElexisType } from "../models/elexistype";
import type { KontaktType } from "../models/kontakt-model";
import {caseManager} from '../models'
export let entity:EncounterType;
// const cm=new CaseManager()
const um=new UserManager()
let sum: Money;

const kons=new EncounterModel(entity)
kons.getSum().then((s) => (sum = s));
// kons.getKonsText().then(result=>entry=result.html)
const text=kons.getKonsText()
function changed(event){
  kons.setKonsText(event.detail)
}
async function saveEncounter(){
  console.log("Save event")
  await kons.save()
}
const dat=DateTime.fromISO(entity.datum)
const weekday=weekDaysShort[dat.weekday-1]
const konsDate=weekday+", "+dat.toFormat($_('formatting.date'))+
(entity.zeit ? ", "+entity.zeit.substring(0, 2) + ':' + entity.zeit.substring(2, 4) : "")

let casedef=""
let fall:CaseType
let cases=undefined
kons.getCase().then(f=>{
  fall=f
  casedef=caseManager.getLabel(fall)
})

let mandator:KontaktType
let mandators:Array<KontaktType>=undefined
kons.getMandator().then(m=>{
  mandator=m
})
async function loadCases(){
  if(fall){
    const patid=fall.patientid
    const caseids=await caseManager.loadCasesFor(patid)
    const caselabels=[]
    for(const caseid of caseids){
      caselabels.push(caseManager.getLabel(caseid))
    }
    cases=caselabels
  }
}
async function loadMandators(){
  mandators=await um.getAllMandators()
}
let locked=false
</script>

<template>
  <div class="flex">
    <div class="font-bold">{konsDate}</div>
    {#if mandators}
      <select class="ml-3">
        {#each mandators as m}
          <option>{m.bezeichnung3}</option>
        {/each}
      </select>
    {:else if mandator}
      <div
        class="ml-3 cursor-pointer bg-blue-100 rounded-5"
        on:click="{loadMandators}">
        ({mandator.bezeichnung3})
      </div>
    {/if}
    {#if cases}
      <select class="ml-3">
        {#each cases as caselabel}
          <option>{caselabel}</option>
        {/each}
      </select>
    {:else}
      <div class="cursor-pointer ml-3 bg-blue-100" on:click="{loadCases}">
        {casedef}
      </div>
    {/if}
  </div>
  {#await text}
    <p>wait</p>
  {:then result}
    <Editor
      contents="{result.json || result.html}"
      extensions="{[Macros]}"
      on:changed="{changed}"
      editable="{!locked}" />
  {/await}
  <p class="text-sm text-gray-600">
    {$_("encounter.billed")}: {sum?.getFormatted()}
  </p>
</template>
