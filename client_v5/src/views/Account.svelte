<script lang="ts">
    import {currentUser} from '../services/store'
    import {login,logout} from '../services/io'
    import LineInput from '../widgets/LineInput.svelte';

let username:string=""
let password:string=""

</script>
<template>
    {#if $currentUser}
    <p>{JSON.stringify($currentUser)}</p>   
    <button on:click={logout}>Log out</button>
        {:else}
       <LineInput label="Username" bind:value={username}></LineInput>
       <LineInput label="Password" bind:value={password}></LineInput>
       <button on:click="{()=>login(username,password)}">Login</button>
    {/if}
</template>