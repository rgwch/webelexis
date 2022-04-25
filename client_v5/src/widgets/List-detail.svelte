<script lang="ts">
    import Listview from "../components./components/Listview.svelte";
    export let list:Array<any>=[]

</script>
<template>
    <div>
        <Listview {list}></Listview>
    </div>
    <div>
        <slot></slot>
    </div>
</template>