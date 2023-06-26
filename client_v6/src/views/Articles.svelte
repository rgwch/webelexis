<script lang="ts">
  import { _ } from "svelte-i18n";
  import Barcode, { scanResult } from "../components/Barcode.svelte";
  import StockDisplay from "../components/StockDisplay.svelte";
  import { prescriptionManager } from "../models";
  import StockItem from "../components/StockItem.svelte";
  import Card from "../widgets/Card.svelte";
  import type { StockEntryType } from "../models/stock-model";
  import ArticleSelector from "../components/ArticleSelector.svelte";
  const title = +"rticle";
  let scanner = false;
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
  let current: StockEntryType = undefined;
</script>

<template>
  <div class="flex">
    <Card>
      <div slot="heading">Alle Artikel</div>
      <div class="overflow-auto max-h-[80vh] max-w-full" slot="body">
        <ArticleSelector />
      </div>
    </Card>
    <Card>
      <div slot="heading">Lagerartikel</div>
      <div class="overflow-auto max-h-[80vh] max-w-full" slot="body">
        <StockDisplay
          on:select={(event) => {
            current = event.detail;
          }}
        />
      </div>
    </Card>
    <Card>
      <div slot="heading">Ausgewählter Artikel</div>
      <div slot="body">
      <StockItem entity={current} />
    </div>
    </Card>

    {#if scanner}
      <div><Barcode on:scanned={scanned} /></div>
    {/if}
  </div>
</template>
