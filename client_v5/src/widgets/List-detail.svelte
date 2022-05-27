<script lang="ts">
    import Listview from "../widgets/Listview.svelte";
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