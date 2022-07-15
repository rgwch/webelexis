<script lang="ts">
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import Agenda from "./Agenda.svelte";
  import Billing from "./Billing.svelte";
  import Emr from "./Emr.svelte";
  import Account from "./Account.svelte";
  import { currentUser } from "../services/store";
  import { _ } from "svelte-i18n";
  $: label = $currentUser?.id || $_("actions.login");
</script>

<template>
  <main>
    <div class="md:container md:mx-auto px-2">
      <Router>
        <nav>
          {#if $currentUser}
            <Link to="emr">{$_("menu.emr")}</Link>
            <Link to="agenda">{$_("menu.agenda")}</Link>
            <Link to="billing">{$_("menu.billing")}</Link>
          {/if}
          <Link to="account" class="ml-8 right-auto">{label}</Link>
        </nav>
        <div>
          {#if $currentUser}
            <Route path="/" component={Emr} />
          {:else}
            <Route path="/" component={Account} />
          {/if}
          <Route path="agenda" component={Agenda} />
          <Route path="billing" component={Billing} />
          <Route path="emr" component={Emr} />
          <Route path="account" component={Account} />
        </div>
      </Router>
    </div>
  </main>
</template>

<style windi:preflights:global windi:safelist:global>
</style>
