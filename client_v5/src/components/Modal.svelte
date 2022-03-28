<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let title: string;

	function close(val) {
		dispatch('closed', val);
	}
	function keyboard(event) {
		if (event.key == 'Enter') {
			close(true);
		} else if (event.key == 'Escape') {
			close(false);
		}
	}
</script>

<svelte:window on:keydown={keyboard} />
<template>
	<div
		class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-600 bg-opacity-80"
	>
		<div class="bg-white rounded-lg w-1/2">
			<div class="flex flex-col p-4">
				<div class="flex items-center w-full">
					<div class="text-gray-800 font-medium text-lg">{title}</div>
				</div>
				<hr />
				<div class="my-5 w-full">
					<slot name="body" />
				</div>
				<hr />
				<div class="ml-auto">
					<slot name="buttons">
						<button
							class="bg-transparent
						hover:bg-gray-500 
						text-blue-700 
						font-semibold 
						hover:text-white 
						py-2 px-4 
						border border-blue-500 
						hover:border-transparent 
						rounded"
							on:click={() => close(false)}
						>
							{$_('actions.cancel')}
						</button>
						<button
							on:click={() => close(true)}
							on:keydown={keyboard}
							class="bg-blue-500 
								hover:bg-blue-700 
								text-white 
								font-bold 
								py-2 px-4 rounded"
						>
							{$_('actions.ok')}
						</button>
					</slot>
				</div>
			</div>
		</div>
	</div>
</template>
