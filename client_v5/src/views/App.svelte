<script lang="ts">
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import Agenda from "./Agenda.svelte";
  import Billing from "./Billing.svelte";
  import Emr from "./Emr.svelte";
</script>

<template>
  <div class="md:container md:mx-auto px-2">
    <Router>
      <nav>
        <Link to="emr">KG</Link>
        <Link to="agenda">Agenda</Link>
        <Link to="billing">Abrechnung</Link>
      </nav>
      <div>
        <Route path="agenda" component={Agenda} />
        <Route path="/" component={Billing} />
        <Route path="billing" component={Billing} />
        <Route path="emr" component={Emr} />
      </div>
    </Router>
  </div>
</template>

<style windi:preflights:global windi:safelist:global>
</style>
