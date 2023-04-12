<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { currentUser } from "../services/store";
  import LineInput from "../widgets/LineInput.svelte";
  import UserDetail from "../components/UserDetail.svelte";
  import { userManager as um } from "../models";
  import { navigate } from "svelte-navigator";
  import { _ } from "svelte-i18n";
  let username: string = "";
  let password: string = "";
  let invalid = false;
  async function login() {
    try {
      const user = await um.login(username, password);
      if (user) {
        navigate("/");
      } else {
        invalid = true;
      }
    } catch (err) {
      invalid = true;
    }
  }
  onMount(() => {
    window.addEventListener("keypress", handleKeydown);
  });
  onDestroy(() => {
    window.removeEventListener("keypress", handleKeydown);
  });
  function handleKeydown(event) {
    if (event.code == "Enter") {
      login();
    }
    return true;
  }
  if (!$currentUser) {
    um.login().then((user) => {
      if (user) {
        navigate("/");
      }
    });
  }
</script>

<template>
  {#if $currentUser}
    <UserDetail entity={$currentUser} />
    <button class="roundbutton" on:click={() => um.logout()}
      >{$_("actions.logout")}</button
    >
  {:else}
    <div class="flex p-4 mx-2">
      <LineInput
        on:textChanged={() => {
          invalid = false;
        }}
        label={$_("titles.username")}
        bind:value={username}
      />
      <LineInput label={$_("titles.password")} bind:value={password} />
    </div>
    {#if invalid}
      <p class="text-red-600 px-4 mx-2">{$_("validation.invalidlogin")}</p>
    {/if}
    <button class="roundbutton" on:click={login}>{$_("actions.login")}</button>
  {/if}
</template>
