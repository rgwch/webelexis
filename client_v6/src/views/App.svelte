<script lang="ts">
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import Agenda from "./Agenda.svelte";
  import Billing from "./Billing.svelte";
  import Emr from "./Emr.svelte";
  import Account from "./Account.svelte";
  import { currentUser } from "../services/store";
  import { _ } from "svelte-i18n";
  import { userManager } from "../models";
  let showBilling = false;
  $: label = $currentUser?.id || $_("actions.login");
  $: {
    userManager.hasACE($currentUser, "bills").then((r) => {
      showBilling = r;
    });
  }
</script>

<template>
  <main>
    <div class="md:container md:mx-auto px-2">
      <Router>
        <nav class="bg-gray-200">
          <div class="px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-8 flex-nowrap">
              {#if $currentUser}
                <Link class="text-blue-800 w-16 text-center" to="agenda"
                  >{$_("menu.agenda")}</Link
                >
                <Link class="text-blue-800 w-16 text-center" to="emr"
                  >{$_("menu.emr")}</Link
                >
                {#if showBilling}
                  <Link class="text-blue-800 w-16 text-center" to="billing"
                    >{$_("menu.billing")}</Link
                  >
                {/if}
              {/if}
              <span class="flex-1">&nbsp;</span>
              <Link to="account" class="ml-8 right-auto text-blue-800"
                >{label}</Link
              >
            </div>
          </div>
        </nav>
        <div>
          {#if $currentUser}
            <Route path="/" component={Agenda} />
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
