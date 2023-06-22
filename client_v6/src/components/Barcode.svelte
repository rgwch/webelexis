<script lang="ts">
  import { Html5QrcodeScanner } from "html5-qrcode";
  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }

  const scanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ true
  );
  scanner.render(onScanSuccess,onScanFailure)
</script>

<template>
  <div id="reader" style="width:600px" />
</template>
