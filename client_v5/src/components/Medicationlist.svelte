<script lang="ts">
import type {
  PrescriptionType,
  ArticleType,
} from "../models/prescription-model";
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

/**
 * user drags an object over us. We'll accept only if it is a "Webelexis" object.
 * @param event
 */
function dragOver(event) {
  if (
    event.dataTransfer.types.find((el) => el.startsWith("webelexis")) &&
    this.list
  ) {
    event.preventDefault();
    this.mark(true);
  }
  return true;
}
/**
 * User dropped an item (article or prescription) on us.
 * @param event
 */
function dragDrop(event) {
  event.preventDefault();
  this.mark(false);
  const datatype = event.dataTransfer.getData("webelexis/datatype");
  const json = event.dataTransfer.getData("webelexis/object");
  if (datatype == "article") {
    const obj: ArticleType = JSON.parse(json);
    this.pm.createFromArticle(obj).then((presc) => {
      //this.list.push(presc)
      this.addItem(presc, Modalities.DONTKNOW);
    });
  } else if (datatype == "prescriptions") {
    const obj: PrescriptionType = JSON.parse(json);
    const mod = event.dataTransfer.getData("webelexis/modality");
    if (mod != this.modality) {
      // console.log("drop: " + obj + ", " + mod)
      this.addItem(obj, mod);
    }
  }
}

/**
 * drag/drop operation is finished or cancelled
 * @param event
 */
function dragLeave(event) {
  this.mark(false);
}

/**
 * user started a drag action -> create data to identify dragged object
 * @param event
 */
function drag(event) {
  const obj = this.list.find((el) => event.target.id.endsWith(el.id));
  event.dataTransfer.setData("text/plain", event.target.id);
  event.dataTransfer.setData("webelexis/object", JSON.stringify(obj));
  event.dataTransfer.setData("webelexis/modality", this.modality);
  event.dataTransfer.setData("webelexis/datatype", "prescriptions");
  return true;
}
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
