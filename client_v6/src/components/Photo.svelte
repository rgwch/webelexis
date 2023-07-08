<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Dropdown from "../widgets/Dropdown.svelte";
  let cameras = [];
  let camera = undefined;
  let mediaStream;
  let elemVideo;
  let elemCanvas;

  onMount(async () => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      /*
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
          },
        })
        .then((mediaStream) => {
          hasAccess = true;
          elemVideo.srcObject = mediaStream;
        });*/
      const devices = await navigator.mediaDevices.enumerateDevices();
      cameras = devices.filter((device) => device.kind === "videoinput");
    }
  });
  function photo() {
    console.log(elemVideo.height, elemVideo.videoHeight);
    elemCanvas.height = elemVideo.videoHeight;
    elemCanvas
      .getContext("2d")
      .drawImage(elemVideo, 0, 0, elemCanvas.width, elemCanvas.height);
    const image_data = elemCanvas.toDataURL("image/jpeg");
    console.log(image_data);
  }
  async function changed(event) {
    /*
    if (mediaStream) {
      const tracks=mediaStream.getTracks()
      tracks.array.forEach(track => {
        track.stop();
      });
      mediaStream=null

    }
    */
    elemVideo.srcObject = null;
    const secam = event.detail;
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        deviceId: {
          exact: event.detail.deviceId,
        },
      },
    });
    elemVideo.srcObject = mediaStream;
    elemVideo.play();
  }
</script>

<template>
  <Dropdown
    elements={cameras}
    selected={camera}
    label="Kamera wählen"
    render={(def) => def?.label || "keine Kamera"}
    on:changed={changed}
  />
  <video bind:this={elemVideo} width="640"><track kind="captions" /></video>
  <canvas bind:this={elemCanvas} width="640" />
  <button on:click={photo}>Click</button>
</template>
