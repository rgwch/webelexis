<script lang="ts">
import type {
  PrescriptionType,
  ArticleType,
} from "../models/prescription-model";
import { Modalities, PrescriptionManager } from "../models/prescription-model";
import {
  currentPatient,
  currentActor,
  currentRezept,
  messageBroker as mb,
} from "../services/store";
import props from "../services/properties";
import defs from "../services/util";
const pm = new PrescriptionManager();
export let list: Array<PrescriptionType> = [];
export let modality: string;
export let h = "6em";

let dosisFocus: boolean = false;
let numberFocus: boolean = false;
mb.subscribe(props.REMOVE_MESSAGE, (msg) => {
  if (msg.source != modality && msg.origin == modality) {
    const presc: PrescriptionType = msg.obj;
    if (list) {
      const idx = list.findIndex((el) => el.id == presc.id);
      if (idx != -1) {
        list.splice(idx, 1);
        list=list
      }
    }
  }
});
mb.subscribe(props.ADD_MESSAGE, (msg) => {
  if (modality == msg.dest) {
    addItem(msg.obj, msg.fromModality);
  }
});
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
        lbl += " [" + defs.ElexisDateToLocalDate(o.datefrom);
        if (o.dateuntil) {
          if (o.dateuntil != o.datefrom) {
            lbl += "-" + defs.ElexisDateToLocalDate(o.dateuntil);
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
    let rezept = $currentRezept;
    obj._Rezept = rezept;
    obj.rezeptid = rezept.id;
    if (!obj.anzahl) {
      obj.anzahl = "1";
    }
    pm.cloneAs(obj, Modalities.RECIPE).then((result) => {
      list = [...list, obj];
      // list.push(obj);
    });
  } else {
    obj.presctype = modality;
    pm.save(obj).then((result) => {
      mb.publish(props.REMOVE_MESSAGE, {
        obj,
        source: modality,
        origin: fromModality,
      });
      list = [...list, obj];
    });
  }
}
/**
 * User pressed a key in an editable field. If it's CR: close field.
 * @param event
 */
function checkkey(event) {
  if (event.keyCode == 13) {
    opened = -1;
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
    list
  ) {
    event.preventDefault();
    mark(true);
  }
  return true;
}
/**
 * User dropped an item (article or prescription) on us.
 * @param event
 */
function dragDrop(event) {
  event.preventDefault();
  mark(false);
  const datatype = event.dataTransfer.getData("webelexis/datatype");
  const json = event.dataTransfer.getData("webelexis/object");
  if (datatype == "article") {
    const obj: ArticleType = JSON.parse(json);
    pm.createFromArticle($currentPatient, $currentActor, obj).then((presc) => {
      //list.push(presc)
      addItem(presc, Modalities.DONTKNOW);
    });
  } else if (datatype == "prescriptions") {
    const obj: PrescriptionType = JSON.parse(json);
    const mod = event.dataTransfer.getData("webelexis/modality");
    if (mod != modality) {
      // console.log("drop: " + obj + ", " + mod)
      addItem(obj, mod);
    }
  }
}

/**
 * drag/drop operation is finished or cancelled
 * @param event
 */
function dragLeave(event) {
  mark(false);
}

/**
 * user started a drag action -> create data to identify dragged object
 * @param event
 */
function drag(event) {
  const obj = list.find((el) => event.target.id.endsWith(el.id));
  event.dataTransfer.setData("text/plain", event.target.id);
  event.dataTransfer.setData("webelexis/object", JSON.stringify(obj));
  event.dataTransfer.setData("webelexis/modality", modality);
  event.dataTransfer.setData("webelexis/datatype", "prescriptions");
  return true;
}

/**
 * create  visual feedback for possible drop zones when dragging a prescription or an article
 * @param mode
 */
function mark(mode: boolean) {
  if (mode) {
    dropzone.style.border = "dashed 2px orange";
  } else {
    dropzone.style.border = "none";
  }
}

function save(fm) {}
let dropzone: HTMLElement;
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
  overflow-y: auto;
}
</style>
