<script lang="ts">
	import DatePicker from './DatePicker.svelte';
	import {DateTime} from 'luxon'
	import {createEventDispatcher} from 'svelte'
	const dispatch=createEventDispatcher()
	
	/**
	 * Predefined value. Should be a Javascript-Date compliant formatted string
	 */
	export let dateString: string = '1981-03-09';
	let current: Date = new Date(dateString)
	/**
	 * Optional label
	 */
	export let label: string = '';

	export let id: string = Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
		.substr(0, 5);
	/**
	 * Disable input
	 */
	export let disabled: boolean = false;
	function changed() {
		const ndate=DateTime.fromJSDate(current).toFormat("yyyy-LL-dd")
		//console.log('date changed from ',dateString," to ", ndate);
		dateString = ndate;
		dispatch('dateChanged')
	}
	
</script>

<style>

</style>

<!-- @component DateInput 
A label and a DatePicker
-->
<template>
	<div class="formfield flex flex-col">
		{#if label}
			<label for={id}>{label}</label>
		{/if}
		<DatePicker {current} on:select={changed} {id} {disabled} />
	</div>
</template>
