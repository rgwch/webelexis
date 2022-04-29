<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import '../services/i18n/i18n';
	import LineInput from './LineInput.svelte';
	import MarginDecorator from './MarginDecorator.svelte';

  const validate= val=>val.length>2
</script>

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
	<h1 class="font-bold text-lg">DateInput</h1>
	<p class="mb-5">
		A LineInput.
	</p>
	<p>Sends 'textChanged' event if new Text entered</p>
</div>

<Meta
	title="Form-Inputs/LineInput"
	component={LineInput}
	argTypes={{ onTextChanged: { action: 'textChanged' } }}
/>

<Template let:args>
	<MarginDecorator>
		<LineInput {...args} on:textChanged={args.onTextChanged} />
	</MarginDecorator>
</Template>

<Story name="enabled" args={{ value: '', label: 'Enter less than 3 chars for error' , validate }} />

<Story name="disabled" args={{ value: 'disable', label: 'cant change', disabled: true }} />
