<script lang="ts">
  import { Html5QrcodeScanner } from "html5-qrcode";
  import { onMount } from "svelte";
  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }
  let scanner;

  onMount(() => {
    scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ true
    );
  });
</script>

<template>
  <h2>Barcode</h2>
  <p on:click={() => scanner.render(onScanSuccess, onScanFailure)}>Scan!</p>
  <div id="reader" style="width:600px" />
</template>
