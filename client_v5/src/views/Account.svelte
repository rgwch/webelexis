<script lang="ts">
import { currentUser } from "../services/store";
import LineInput from "../widgets/LineInput.svelte";
import UserDetail from "../components/UserDetail.svelte";
import {userManager as um} from '../models'
let username: string = "";
let password: string = "";
</script>

<template>
  {#if $currentUser}
    <UserDetail entity="{$currentUser}" />
    <button class="roundbutton" on:click="{()=>um.logout()}">Log out</button>
  {:else}
    <div class="flex p-4 mx-2">
      <LineInput label="Username" bind:value="{username}" />
      <LineInput label="Password" bind:value="{password}" />
    </div>
    <button class="roundbutton" on:click="{() => um.login(username, password)}"
      >Login</button>
  {/if}
</template>
