<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { DateTime } from "luxon";
  import { documentManager } from "../models";
  import { currentPatient } from "../services/store";
  import Dropdown from "../widgets/Dropdown.svelte";
  import Modal from "../widgets/Modal.svelte";
  import LineInput from "../widgets/LineInput.svelte";
  const defaultDevice = "PHOTO_DEFAULT_DEVCICE";
  let fileDialog = false;
  let cameras = [];
  let camera;
  try {
    camera = JSON.parse(localStorage.getItem(defaultDevice));
  } catch (ex) {
    console.log(ex);
    localStorage.removeItem(defaultDevice);
  }

  let mediaStream;
  let elemVideo: HTMLVideoElement;
  let elemCanvas: HTMLCanvasElement;
  let imageData;
  let fileName;

  onMount(async () => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      cameras = devices.filter((device) => device.kind === "videoinput");
      if (cameras.length > 1) {
        if (!camera) {
          camera = cameras[0];
        }
      }
      if (camera) {
        await changed({
          detail: camera,
        });
      }
    }
  });
  onDestroy(() => {
    changed(null);
  });
  /**
   * User requested image from video stream. Create snapshot.
   */
  function photo() {
    console.log(elemVideo.height, elemVideo.videoHeight);
    elemCanvas.height = elemVideo.videoHeight;
    elemCanvas.width = elemVideo.videoWidth;
    const context = elemCanvas.getContext("2d");
    context.drawImage(elemVideo, 0, 0, elemCanvas.width, elemCanvas.height);
    imageData = elemCanvas.toDataURL("image/jpeg");
    fileName =
      DateTime.fromJSDate(new Date()).toFormat("yyyy-LL-dd_HHmm") +
      "_photo.jpg";
    fileDialog = true;
    localStorage.setItem(defaultDevice, JSON.stringify(camera));
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, elemCanvas.width, elemCanvas.height);
  }
  async function save() {
    await documentManager.createForPatient(
      $currentPatient,
      fileName,
      imageData.replace("data:image/jpeg;base64,", ""),
      "image/jpeg"
    );
    alert("Saved");
  }
  /**
   * User changed camera. Stop current mediaStream and create a new one
   * @param event if null: Just stop video stream withoud creating new
   */
  async function changed(event) {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].readyState === "live") {
          tracks[i].stop();
        }
      }
      mediaStream = null;
    }

    elemVideo.srcObject = null;
    if (event) {
      const secam = event.detail;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: {
              exact: secam.deviceId,
            },
          },
        });
        camera = secam;
        elemVideo.srcObject = mediaStream;
        elemVideo.play();
      } catch (err) {
        alert(err);
      }
    }
  }
</script>

<template>
  <div>
    {#if fileDialog}
      <Modal
        title="Dateiname"
        dismiss={(val) => {
          fileDialog = false;
          if (val) {
            save();
          }
        }}
      >
        <div slot="body">
          <LineInput bind:value={fileName} label="Dateiname des Fotos" />
        </div>
      </Modal>
    {/if}
    <Dropdown
      elements={cameras}
      selected={camera}
      label="Kamera wählen"
      render={(def) => def?.label || "keine Kamera"}
      on:changed={changed}
    />
    <button class="roundbutton" on:click={photo}>Foto speichern</button>
    <video bind:this={elemVideo} width="320"><track kind="captions" /></video>
    <canvas bind:this={elemCanvas} width="640" />
  </div>
</template>
