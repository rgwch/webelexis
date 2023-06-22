<script lang="ts">
  import { _ } from "svelte-i18n";
  import Barcode from "../components/Barcode.svelte"
  import {prescriptionManager} from '../models'
  const title = +"rticle";
  async function findByEAN(ean:string){
    const result=await prescriptionManager.findArticle("ean="+ean)
    return result;
  }
</script>
<template>
  <div class="flex">
    <Barcode></Barcode>
  </div>
</template>