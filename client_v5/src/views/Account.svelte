<script lang="ts">
import { currentUser } from "../services/store";
import { login, logout } from "../services/io";
import LineInput from "../widgets/LineInput.svelte";
import UserDetail from "../components/UserDetail.svelte";
let username: string = "";
let password: string = "";
</script>

<template>
  {#if $currentUser}
    <UserDetail entity="{$currentUser}" />
    <button class="roundbutton" on:click="{logout}">Log out</button>
  {:else}
    <div class="flex p-4 mx-2">
      <LineInput label="Username" bind:value="{username}" />
      <LineInput label="Password" bind:value="{password}" />
    </div>
    <button class="roundbutton" on:click="{() => login(username, password)}"
      >Login</button>
  {/if}
</template>
