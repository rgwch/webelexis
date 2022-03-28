<script lang="ts">
    import Listview from "./Listview.svelte";
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