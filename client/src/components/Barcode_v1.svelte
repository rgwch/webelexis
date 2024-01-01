<script lang="ts" context="module">
  export type scanResult = {
    debugData: any;
    format: {
      format: number;
      formatName: string;
    };
    text: string;
  };
</script>

<script lang="ts">
  import { Html5QrcodeScanner } from "html5-qrcode";
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  function onScanSuccess(decodedText, decodedResult) {
    if(decodedResult.result.formatName=="EAN_13"){
      console.log(`Code matched = ${decodedText}`, decodedResult);
      const ean=decodedResult.result.text
      // scanner.clear().then(()=>{
        dispatch("scanned", ean);
      //})
    }
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    // console.warn(`Code scan error = ${error}`);
  }
  let scanner;

  onMount(() => {
    scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 100 } },
      /* verbose= */ false
    );
  });
</script>

<template>
  <p on:click={() => scanner.render(onScanSuccess, onScanFailure)}>Scan!</p>
  <div id="reader" style="width:300px;height:150px;" />
</template>
