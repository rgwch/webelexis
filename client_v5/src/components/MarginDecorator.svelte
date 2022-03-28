<!-- Only needed for Storybook to render common tyles (since WindiCSS @apply doesn't seem to be supported) -->
<template>
	<div>
		<slot />
	</div>
</template>

<style global>
	.formfield {
		background-color: rgba(125, 211, 252, 1);
		border-color: rgba(30, 64, 175, 1);
		border-width: 2px;
		padding: 0.25rem;
		margin: 0.25rem;
		/* @apply border-2 border-blue-800 bg-light-blue-300 p-1 m-1; */
	}
	.item {
		cursor: pointer;
		border-style: solid;
		border-width: 2px;
		border-radius: 0.25rem;
		margin: 0.25rem;
		background-color: rgba(243, 244, 246, 1);
		padding-left: 0.75rem;
		padding-right: 0.75rem;
		/* @apply cursor-pointer border-solid border-2 rounded m-1 bg-gray-100 px-3; */
	}
	.item:hover {
		background-color: rgba(156, 163, 175, 1);
		/* @apply bg-gray-400; */
	}
</style>
