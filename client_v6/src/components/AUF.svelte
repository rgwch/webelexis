<script lang="ts">
  import { AUFManager, AUFType } from "../models/auf-model";
  import type { BriefType } from "../models/briefe-model";
  import { currentPatient } from "../services/store";
  import { aufManager, briefManager } from "../models";
  import { _ } from "svelte-i18n";
  import DateInput from "../widgets/DateInput.svelte";
  import Collapse from "../widgets/Collapse.svelte";
  import Card from "../widgets/Card.svelte";
  import util from "../services/util";
  import LineInput from "../widgets/LineInput.svelte";
  import Fa from "svelte-fa";
  import { faPrint } from "@fortawesome/free-solid-svg-icons";

  let aufList: Array<AUFType> = [];
  let selected: Array<boolean> = [];
  let open: Array<boolean> = [];

  aufManager.fetchForPatient($currentPatient.id).then((result) => {
    if (result.total && result.data) {
      aufList = (result.data as Array<AUFType>).sort((a, b) => {
        if (!a.datumauz) {
          return 1;
        }
        if (!b.datumauz) {
          return -1;
        }
        return b.datumauz.localeCompare(a.datumauz);
      });
    }
  });
  /**
   * User clicked on the printer symbol
   */
  async function toPdf(auf: AUFType) {
    const fields = [
      { field: "auf.grund", replace: auf.grund },
      {
        field: "auf.datumvon",
        replace: util.ElexisDateToLocalDate(auf.datumvon),
      },
      {
        field: "auf.datumbis",
        replace: util.ElexisDateToLocalDate(auf.datumbis),
      },
      { field: "auf.prozent", replace: auf.prozent },
      { field: "auf.aufzusatz", replace: auf.aufzusatz },
    ];
    const rp: BriefType = {
      betreff: "AUF-Zeugnis",
      datum: auf.datumauz,
      mimetype: "text/html",
      patientid: $currentPatient.id,
      typ: "AUF-Zeugnis",
    };
    try {
      const processed = await briefManager.generate(rp, "auf-zeugnis", fields);
      await briefManager.print(processed);
      await briefManager.save(processed);
    } catch (err) {
      alert(err);
    }
  }
  async function listToPdf() {
    if (!selected.some((l) => l)) {
      selected = aufList.map((t) => true);
    }
    let liste = "<ul>";
    for (let i = 0; i < aufList.length; i++) {
      if (selected[i]) {
        liste += "<li>" + aufManager.getLabel(aufList[i]) + "</li>";
      }
    }
    liste += "</ul>";
    const field = [
      {
        field: "liste",
        replace: liste,
      },
    ];
    const alist: BriefType = {
      betreff: "AUF-Liste",
      datum: util.DateToElexisDate(new Date()),
      mimetype: "text/html",
      patientid: $currentPatient.id,
      typ: "Allg.",
    };
    try {
      const processed = await briefManager.generate(alist, "auf-liste", field);
      await briefManager.print(processed);
      await briefManager.save(processed);
    } catch (err) {
      alert(err);
    }
  }
  function save(auz) {
    aufManager.save(auz);
  }
</script>

<template>
  {#if $currentPatient}
    <Card>
      <div slot="heading" class="px-4 py-3 sm:px-6 bg-gray-200 flex flex-row">
        <h2 class="text-blue-500">{$_("titles.auflong")}</h2>
        <button class="px-5 tooltip" type="submit" on:click={listToPdf}
          ><Fa icon={faPrint} />
          <span class="tooltiptext">Liste drucken</span>
        </button>
      </div>

      <div slot="body" class="overflow-y-auto">
        <ul>
          {#each aufList as auf, idx}
            <li>
              <div class="flex flex-row">
                <input
                  type="checkbox"
                  bind:checked={selected[idx]}
                  class="mr-4"
                />
                <Collapse
                  title={aufManager.getLabel(auf)}
                  bind:open={open[idx]}
                >
                  <div
                    slot="body"
                    class="border border-blue-600 border-solid p-3 my-3"
                  >
                    <p>
                      Erstellt am: {util.ElexisDateToLocalDate(auf.datumauz)}
                    </p>
                    <div class="flex flex-row justify-between py-4 px-2">
                      <DateInput
                        bind:dateString={auf.datumvon}
                        label="von"
                        on:dateChanged={() => save(auf)}
                      />
                      <DateInput
                        bind:dateString={auf.datumbis}
                        label="bis"
                        on:dateChanged={() => save(auf)}
                      />
                      <span class="flex-shrink w-12">
                        <LineInput
                          width="20px"
                          bind:value={auf.prozent}
                          label="Prozent"
                        />
                      </span>
                    </div>
                    <div class="flex flex-row px-2 pb-4">
                      <LineInput bind:value={auf.grund} label="Grund" />
                      <LineInput
                        bind:value={auf.aufzusatz}
                        label="Bemerkung"
                        on:textChanged={() => {
                          save(auf);
                        }}
                      />
                    </div>
                    <div>
                      <button type="submit" on:click={() => toPdf(auf)}
                        ><Fa icon={faPrint} /></button
                      >
                    </div>
                  </div>
                </Collapse>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </Card>
  {/if}
</template>
