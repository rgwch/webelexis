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
  import { Html5Qrcode } from "html5-qrcode";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let camera;
  let feedback=false;
  let ready=true
  let scanner: Html5Qrcode;
  const config = {
    fps: 10,
    qrbox: {
      width: 250,
      height: 250,
    },
  };
  function onScanSuccess(decodedText, decodedResult) {
    // console.log("success:  "+decodedText)
    if (ready && decodedResult.result.format.formatName == "EAN_13") {
      ready=false;
      //console.log(`Code matched = ${decodedText}`, decodedResult);
      const ean = decodedResult.result.text;
      dispatch("scanned", ean);
      feedback=true;
      setTimeout(()=>{
        feedback=false;
        ready=true
      },1000)
    }
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    // console.log(`Code scan error = ${error}`);
  }

  onMount(async () => {
    /*
    scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 100 } },
      false
    );
    */
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        camera = devices[0].id;
        scanner = new Html5Qrcode("reader", false);
        scanner.start(camera, config, onScanSuccess, onScanFailure);
      }
    } catch (err) {
      console.log("Error setting up camera " + err);
    }
  });
  onDestroy(() => {
    scanner.stop().catch((err) => {
      console.log("Error shutting down camera");
    });
  });
</script>

<template>
  <div id="reader" style="width:300px;height:250px;" />
  <hr />
  {#if feedback}
  <p style="text-align:center;color:blue;font-size:20px">Ok!</p>
  {/if}
</template>
