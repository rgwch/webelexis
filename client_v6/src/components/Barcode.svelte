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
  let cameras = [];
  let feedback: string = undefined;
  let ready = true;
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
      ready = false;
      //console.log(`Code matched = ${decodedText}`, decodedResult);
      const ean = decodedResult.result.text;
      dispatch("scanned", ean);
      feedback = ean;
      setTimeout(() => {
        feedback = undefined;
        ready = true;
      }, 1000);
    }
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    // console.log(`Code scan error = ${error}`);
  }

  async function createScanner() {
    if (scanner && scanner.isScanning) {
      await scanner.stop();
    }
    scanner.start(camera, config, onScanSuccess, onScanFailure);
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
      scanner = new Html5Qrcode("reader", false);
      cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length) {
        camera = cameras[0].id;
        await createScanner();
      }
    } catch (err) {
      console.log("Error setting up camera " + err);
    }
  });
  async function changeCam(cid) {
    camera = cid;
    await createScanner();
  }
  onDestroy(() => {
    if (scanner && scanner.isScanning) {
      scanner.stop().catch((err) => {
        console.log("Error shutting down camera " + err);
      });
    }
  });
</script>

<template>
  <div>
    {#if cameras && cameras.length > 0}
      {#each cameras as cam}
        <p
          class="cam.id==camera:text-blue-300"
          on:click={() => changeCam(cam.id)}
        >
          {cam.label}
        </p>
      {/each}
    {:else}
      <p>Keine Kamera gefunden</p>
    {/if}
  </div>
  <div id="reader" style="width:300px;height:250px;" />
  <hr />
  {#if feedback}
    <p style="text-align:center;color:blue;font-size:20px">{feedback}</p>
  {/if}
</template>
