<script lang="ts">
  import type { CashType } from "../models/cash.model";
  import { cashManager as cm } from "../models";
  import { Money } from "../models/money";
  export let current = new Date();
  let entries: Array<CashType> = [];
  reload(current);
  async function reload(year: Date) {
    entries = await cm.fetchForYear(year);
  }
</script>

<div>
  <table>
    <thead>
      <th>Datum</th>
      <th>Kategorie</th>
      <th>Eintrag</th>
      <th>Betrag</th>
      <th>Total</th>
    </thead>
    {#each entries as e}
      <tr>
        <td>{cm.date(e)}</td>
        <td>{e.category}</td>
        <td>{e.entry}</td>
        <td>{cm.amount(e)}</td>
        <td>{cm.total(e)}</td>
      </tr>
    {/each}
  </table>
</div>
