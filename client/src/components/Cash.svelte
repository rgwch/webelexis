<script lang="ts">
  import type { CashType } from "../models/cash.model";
  import { cashManager as cm } from "../models";
  import { Money } from "../models/money";
  import { _ } from "svelte-i18n";
  import Fa from "svelte-fa";
  import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

  export let current = new Date();
  let entries: Array<CashType> = [];
  let categories: Array<string> = [];
  let extra = false;
  let check = "";
  let year = current.getFullYear();
  reload();
  async function reload() {
    entries = await cm.fetchForYear(current);
    template.date = new Date().toISOString().slice(0, 10);
    template.nr = (parseInt(entries[0].nr) + 1).toString();
    template.entry = "";
    template.category = "";
    template.amount = "0.00";
    check = new Money(entries[0].total).getFormatted();
    year = current.getFullYear();
    /* filter all distinct categories*/
    categories = entries
      .map((e) => e.category)
      .filter((v, i, a) => a.indexOf(v) === i);
  }
  async function nextYear() {
    current.setFullYear(current.getFullYear() + 1);
    await reload();
  }
  async function prevYear() {
    current.setFullYear(current.getFullYear() - 1);
    await reload();
  }
  async function add() {
    const diff = new Money(template.amount);
    if (!diff.isNeglectable()) {
      let total = new Money(entries[0].total).add(diff).getCentsAsString();
      const entry: CashType = {
        nr: template.nr,
        date: template.date,
        category: template.category,
        entry: template.entry,
        amount: template.amount,
        total,
      };
      cm.setDate(template.date, entry);
      await cm.save(entry);
      await reload();
    }
  }
  async function subtract() {
    const diff = new Money(template.amount);
    if (!diff.isNeglectable()) {
      let total = new Money(entries[0].total).subtract(diff).getCentsAsString();
      const entry: CashType = {
        nr: template.nr,
        date: template.date,
        category: template.category,
        entry: template.entry,
        amount: template.amount,
        total,
      };
      cm.setDate(template.date, entry);
      await cm.save(entry);
      await reload();
    }
  }
  const template: CashType = {
    nr: "0",
    date: new Date().toISOString().slice(0, 10),
    category: "",
    entry: "",
    amount: "0.00",
    total: "0.00",
  };
  async function doCheck() {
    const diff = new Money(check).subtract(new Money(entries[0].total));
    console.log(diff);
    let dscr = $_("billing.excess");
    if (diff.isNegative()) {
      dscr = $_("billing.shortage");
    } else if (diff.isNeglectable()) {
      dscr = $_("billing.correct");
    }
    const entry: CashType = {
      nr: template.nr + " " + $_("billing.check"),
      date: template.date,
      category: "",
      entry: dscr,
      amount: diff.getFormatted(),
      total: check,
    };
    cm.setDate(template.date, entry), await cm.save(entry);
    await reload();
  }
  async function do_export() {
    const data = await cm.fetchForYear(current);
    // const csv = data.map((row) => Object.values(row).join(",")).join("\n");
    const cats = new Map<string, number>();
    const csv = data
      .map((row) => {
        cats[row.category] =
          parseInt(cats[row.category] ?? "0") + parseInt(row.amount);
        return `"${row.category}","${row.entry}","${row.amount}","${row.total}"`;
      })
      .join("\n");
    const summary =
      `,"${$_("billing.summary")}:",,\n\n` +
      Object.keys(cats)
        .map((key) => `"${key}","${new Money(cats[key]).getFormatted()}",,`)
        .join("\n");
    // console.log(JSON.stringify(summary));
    const blob = new Blob([csv + "\n\n\n" + summary], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "cash.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  function pad(item: string) {
    return "0".repeat(8 - item.length);
  }
</script>

<div>
  <div class="flex flex-row">
    <h2>{$_("billing.cash")}</h2>
    <button on:click={prevYear}
      ><Fa icon={faCaretLeft} translateX={0.5} /></button
    >
    <span class="mx-2 px-2">{year}</span>
    <button on:click={nextYear}
      ><Fa icon={faCaretRight} translateX={0.5} /></button
    >
    <button
      on:click={() => {
        extra = !extra;
      }}>...</button
    >
  </div>
  {#if extra}
    <div class="flex flex-row">
      <span>{$_("billing.exact")}:&nbsp;</span>
      <input type="text" bind:value={check} width="8" />
      <button on:click={doCheck}>{$_("billing.check")}</button>
    </div>
    <div>
      <button on:click={do_export}>{$_("actions.export")}</button>
    </div>
  {/if}
  <table>
    <thead>
      <th>{$_("billing.number")}</th>
      <th>{$_("encounter.date")}</th>
      <th>{$_("billing.category")}</th>
      <th>{$_("billing.entry")}</th>
      <th>{$_("billing.amount")}</th>
      <th>{$_("billing.total")}</th>
    </thead>
    <tr>
      <td>{template.nr}</td>
      <td><input type="date" bind:value={template.date} /></td>
      <td
        ><select bind:value={template.category}>
          {#each categories as c}
            <option>{c}</option>
          {/each}
        </select></td
      >
      <td><input type="text" bind:value={template.entry} /></td>
      <td><input type="text" bind:value={template.amount} /></td>
      <td
        ><button on:click={add}>+</button><button on:click={subtract}>-</button
        ></td
      >
    </tr>
    {#each entries as e}
      <tr>
        <td>{e.nr}</td>
        <td>{cm.date(e)}</td>
        <td>{e.category ?? " "}</td>
        <td>{e.entry ?? " "}</td>
        <td
          ><span style="visibility: hidden">{pad(cm.amount(e))}</span
          >{cm.amount(e)}</td
        >
        <td>{cm.total(e)}</td>
      </tr>
    {/each}
  </table>
</div>

<style>
  th {
    text-align: left;
  }
  td {
    padding-right: 5px;
    margin-right: 4px;
  }
  td:nth-child(5) {
    font-family: "Courier New", Courier, monospace;
  }
  tr:nth-child(odd) {
    background-color: #f2f2f2;
  }
  button {
    margin-left: 5px;
    padding-left: 2px;
    padding-right: 2px;
    min-width: 2rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  button:hover {
    background-color: blue;
  }
</style>
