<script lang="ts">
  import { Router, Link, Route, navigate } from 'svelte-navigator'
  import Agenda from './Agenda.svelte'
  import Billing from './Billing.svelte'
</script>

<template>
  <!-- div class="container mx-auto px-2" -->
  <Router>
    <nav>
      <Link to="agenda">Agenda</Link>
      <Link to="billing">Abrechnung</Link>
    </nav>
    <div>
      <Route path="agenda" component={Agenda} />
      <Route path="/" component={Billing} />
      <Route path="billing" component={Billing} />
    </div>
  </Router>
  <!-- /div -->
</template>
