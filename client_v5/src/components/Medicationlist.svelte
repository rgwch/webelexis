<script lang="ts">
import type { PrescriptionType } from "../models/prescription-model";
import { Modalities, PrescriptionManager } from "../models/prescription-model";
const pm = new PrescriptionManager();

export let list: Array<PrescriptionType> = [];
export let modality: string = "";
export let h = "6em";

let dosisFocus: boolean = false;
let numberFocus: boolean = false;

let opened = 0.1;
/**
 * Create a human readable label for a prescription
 * @param obj
 */
function getLabel(obj: PrescriptionType) {
  let lbl = "";
  const o = obj;
  if (o) {
    if (o.anzahl) {
      lbl += o.anzahl.toString() + " ";
    }
    if (o._Artikel && o._Artikel["dscr"]) {
      lbl += o._Artikel["dscr"];
    } else {
      lbl += "?";
    }
    if (o.dosis) {
      lbl += " " + o.dosis;
    }
    if (o.bemerkung) {
      lbl += " (" + o.bemerkung + ")";
    }
    if (modality != Modalities.RECIPE) {
      if (o.datefrom) {
        lbl += " [" + pm.ElexisDateToLocalDate(o.datefrom);
        if (o.dateuntil) {
          if (o.dateuntil != o.datefrom) {
            lbl += "-" + pm.ElexisDateToLocalDate(o.dateuntil);
          }
        }
        lbl += "]";
      }
    }
  }
  return lbl;
}
/**
 * Add a prescription to our list
 * @param obj the prescription to add
 * @param fromModality the source modality
 */
function addItem(obj: PrescriptionType, fromModality: string) {
  if (modality == Modalities.RECIPE) {
    let rezept = undefined; //we.getSelectedItem("rezepte");
    obj._Rezept = rezept;
    obj.rezeptid = rezept.id;
    if (!obj.anzahl) {
      obj.anzahl = "1";
    }
    pm.cloneAs(obj, Modalities.RECIPE).then((result) => {
      this.list.push(obj);
    });
  } else {
    obj.presctype = modality;
    pm.save(obj).then((result) => {
      // this.ea.publish(REMOVE_MESSAGE, { obj, source: this.modality, origin: fromModality })
      list.push(obj);
    });
  }
}
/**
 * User pressed a key in an editable field. If it's CR: close field.
 * @param event
 */
function checkkey(event) {
  if (event.keyCode == 13) {
    this.opened = -1;
  }
  return true;
}
function expand(idx) {
  if (opened == idx) {
    opened = -1;
  } else {
    opened = idx;
    if (modality == Modalities.RECIPE) {
      numberFocus = true;
    } else {
      dosisFocus = true;
    }
  }
  // this.signaler.signal('expand')
}
function dragOver(event) {}
function dragDrop(event) {}
function dragLeave(event) {}
function drag(event) {}
function save(fm) {}
let dropzone;
</script>

<template>
  <div
    style="overflow:auto;height:{h}"
    on:dragover="{dragOver}"
    on:drop="{dragDrop}"
    bind:this="{dropzone}"
    on:dragleave="{dragLeave}">
    <div class="compactlist">
      {#if Array.isArray(list)}
        {#each list as fm, index}
          <div>
            {#if index === opened && modality == "2"}
              <span>
                <input
                  type="text"
                  style="width:4em;"
                  id="anzahl"
                  bind:value="{fm.anzahl}"
                  on:blur="{() => save(fm)}"
                  on:keydown="{checkkey}"
                  on:focus="{() => {
                    numberFocus = true;
                  }}" />
              </span>
            {/if}

            <span
              class="noselect"
              on:click="{() => expand(index)}"
              draggable="true"
              on:dragstart="{drag}"
              id="prescription::${fm.id}">
              {getLabel(fm)}
            </span>
            {#if index === opened}
              <span>
                <input
                  type="text"
                  style="width:6em;"
                  id="dosis"
                  bind:value="{fm.dosis}"
                  on:blur="{() => save(fm)}"
                  on:keydown="{checkkey}"
                  on:focus="{() => (dosisFocus = true)}" /><br />
                <input
                  type="text"
                  style="width: 32em;"
                  id="remark"
                  bind:value="{fm.bemerkung}"
                  on:blur="{() => save(fm)}"
                  on:keydown="{checkkey}" />
              </span>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</template>

<style>
.compactlist {
  padding-top: 0px;
  padding-bottom: 1px;
  margin-top: 0px;
  margin-bottom: 1px;
  font-size: smaller;
  cursor: pointer;
  color: black;
  display: block;
}
</style>
