<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  let hasCameraApi = false;
  let hasAccess = false;
  let elemVideo;
  let elemCanvas;

  onMount(() => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      hasCameraApi = true;
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
          },
        })
        .then((mediaStream) => {
          hasAccess = true;
          elemVideo.srcObject = mediaStream;
        });
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
</script>

<template>
  {#if hasAccess}
    <p>access granted</p>
  {:else}
    <p>No camera found</p>
  {/if}
  <video bind:this={elemVideo} autoplay width="640"
    ><track kind="captions" /></video
  >
  <canvas bind:this={elemCanvas} width="640" />
  <button on:click={photo}>Click</button>
</template>
