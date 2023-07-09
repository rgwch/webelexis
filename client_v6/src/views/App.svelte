<script lang="ts">
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import Agenda from "./Agenda.svelte";
  import Billing from "./Billing.svelte";
  import Emr from "./Emr.svelte";
  import Account from "./Account.svelte";
  import Article from "./Articles.svelte";
  import Video from "./Video.svelte";
  import { currentUser } from "../services/store";
  import { _ } from "svelte-i18n";
  import { userManager } from "../models";
  import Menu from "../widgets/Menu.svelte";
  import type { MenuDef } from "../widgets/Popup.svelte";
  const menuDef: Array<MenuDef> = [
    {
      name: "agenda",
      label: $_("menu.agenda"),
    },
    {
      name: "emr",
      label: $_("menu.emr"),
    },
    {
      name: "article",
      label: $_("menu.article"),
    },
    {
      name: "photo",
      label: "Photo",
    },
    {
      name: "billing",
      label: $_("menu.billing"),
    },
    {
      name: "account",
      label: "Konto",
    },
  ];
  let showBilling = false;
  $: label = $currentUser?.id || $_("actions.login");
  $: {
    userManager.hasACE($currentUser, "bills").then((r) => {
      showBilling = r;
    });
  }
  function selected(event) {
    navigate(event.detail);
  }
</script>

<template>
  <main>
    <div class="w-full md(container mx-auto px-2)">
      <Router>
        <Menu menudef={menuDef} on:menuselect={selected} />
        {#if $currentUser}
          <Route path="/" component={Agenda} />
        {:else}
          <Route path="/" component={Account} />
        {/if}
        <div class="mt-10">
          <Route path="agenda" component={Agenda} />
          <Route path="billing" component={Billing} />
          <Route path="emr" component={Emr} />
          <Route path="account" component={Account} />
          <Route path="article" component={Article} />
          <Route path="photo" component={Video} />
        </div>
      </Router>
    </div>
  </main>
</template>

<style windi:preflights:global windi:safelist:global>
</style>
