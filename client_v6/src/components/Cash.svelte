<script lang="ts">
  import type { CashType } from "../models/cash.model";
  import { cashManager as cm } from "../models";
  import { Money } from "../models/money";
  import { _ } from "svelte-i18n";
  export let current = new Date();
  let entries: Array<CashType> = [];
  let categories: Array<string> = [];
  reload(current);
  async function reload(year: Date) {
    entries = await cm.fetchForYear(year);
    template.nr = (parseInt(entries[0].nr) + 1).toString();
    /* filter all distinct categories*/
    categories = entries
      .map((e) => e.category)
      .filter((v, i, a) => a.indexOf(v) === i);
  }
  async function add() {
    const diff = new Money(template.amount);
    if (!diff.isNeglectable) {
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
      await reload(new Date(template.date));
    }
  }
  async function subtract() {
    const diff = new Money(template.amount);
    if (!diff.isNeglectable) {
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
      await reload(new Date(template.date));
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
</script>

<div>
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
        <td>{e.category}</td>
        <td>{e.entry}</td>
        <td>{cm.amount(e)}</td>
        <td>{cm.total(e)}</td>
      </tr>
    {/each}
  </table>
</div>

<style>
  td {
    padding-right: 10px;
    margin-right: 4px;
  }
  button {
    margin: 0 2px;
    padding: 2px 6px;
    width: 2rem;
    border-radius: 2px;
    border: 1px solid #ccc;
    background-color: aqua;
  }
</style>
