<script lang="ts">
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import Agenda from "./Agenda.svelte";
  import Billing from "./Billing.svelte";
  import Emr from "./Emr.svelte";
  import Account from "./Account.svelte";
  import Article from "./Articles.svelte";
  import Video from "./Video.svelte";
  import NewPatient from "./NewPatient.svelte"
  import { currentUser } from "../services/store";
  import { _ } from "svelte-i18n";
  import { userManager } from "../models";
  import Menu from "../widgets/Menu.svelte";
  import type { MenuDef } from "../widgets/Popup.svelte";

  let showBilling = false;
  let label = $_("actions.login");
  let menuDef: Array<MenuDef> = [];

  currentUser.subscribe((user) => {
    if (user) {
      label = user.id;
      userManager.hasACE(user, "bills").then((r) => {
        showBilling = r;
        menuDef = [
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
            visible: () => showBilling,
          },
          {
            name: "account",
            label,
          },
        ];
      });
    } else {
      label = $_("actions.login");
      menuDef = [
        {
          name: "account",
          label,
        },
      ];
    }
  });
  function selected(event) {
    navigate(event.detail);
  }
</script>

<template>
  <main>
    <div class="w-full md(container mx-auto px-2)">
      <Router>
        <Menu {menuDef} on:menuselect={selected} />
        {#if $currentUser}
          <div class="mt-10 m-2">
            <Route path="/" component={Agenda} />
            <Route path="agenda" component={Agenda} />
            <Route path="billing" component={Billing} />
            <Route path="emr" component={Emr} />
            <Route path="article" component={Article} />
            <Route path="photo" component={Video} />
            <Route path="account" component={Account} />   
          </div>  
        {:else}
          <Route path="/" component={NewPatient} />
          <Route path="account" component={Account} />   
        {/if}
      </Router>
    </div>
  </main>
</template>

<style windi:preflights:global windi:safelist:global>
</style>
