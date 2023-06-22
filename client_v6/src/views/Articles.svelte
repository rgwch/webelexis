<script lang="ts">
  import { _ } from "svelte-i18n";
  import Barcode, { scanResult } from "../components/Barcode.svelte";
  import { prescriptionManager } from "../models";
  const title = +"rticle";
  async function findByEAN(ean: string) {
    const result = await prescriptionManager.getByEAN(ean);
    return result;
  }
  function scanned(event) {
    const result: scanResult = event.detail as scanResult;
    if (result.format.formatName == "EAN_13") {
      findByEAN(result.text /*"7680555130082"*/).then((article) => {
        if (article) {
          console.log(JSON.stringify(article));
        } else {
          console.log("Kein Artikel gefunden mit EAN: " + result.text);
        }
      });
    }
  }
</script>

<template>
  <div class="flex">
    <Barcode on:scanned={scanned} />
  </div>
</template>
