<script lang="ts">
  import type { EncounterType } from "../models/encounter-model";
  import {currentEncounter} from '../services/store'
  import BillingSelector from "./BillingSelector.svelte";
  import {leistungsblockManager as lbm} from '../models/leistungsblock-model'
  import {billingsManager as bm, type BillingType} from '../models/billings-model'
  let dragging=false
  let billings: Array<BillingType> = [];
  $: bm.getBillings($currentEncounter?.id).then(result=>{
    billings=result
  })
  function dragover(event){
    event.preventDefault()
    dragging=true
    return true;
  }
  function dragleave(event){
    dragging=false
    return true;
  }
  function dragdrop(event){
    event.preventDefault()
    const data = event.dataTransfer.getData("text");
    if (data.startsWith("block")) {
      lbm
        .applyBlock(data.substring("block!".length), this.kons, this.billings)
        .then(block => {
          this.loadBillings();
        });
    } else {
      bm.getBillable(data).then(billable => {
        bm
          .createBilling(billable, $currentEncounter, 1, billings)
          .then(async billing => {
            billings=billings
          })
          .catch(err => {
            alert("could not create Billing " + err);
          });
      });
    }
    dragging=false;
    return true;

  }
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-auto h-60">
      <BillingSelector />
    </div>
    <div
      class="border-blue-300 border-2 p-1 mt-4 min-h-20 overflow-auto"
      class:dragging={"bg-red-100"}
      on:dragover={dragover}
      on:dragleave={dragleave}
      on:drop={dragdrop}
    >
      <div>
        <button>+</button><button>X</button><button>-</button>
      </div>
      <div>
        {#each billings as item}
          <p class="text-sm">
            {item.zahl}&nbsp;
            {bm.getCode(item)}&nbsp;
            {item.leistg_txt}
          </p>
        {/each}
      </div>
    </div>
  </div>
</template>
