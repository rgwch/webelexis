<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import '../services/i18n/i18n';
	import Calendar from './Calendar.svelte';
	import MarginDecorator from './MarginDecorator.svelte';
</script>

<Meta title="Widgets/Calendar" component={Calendar} />

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
	<h1 class="font-bold text-lg">Calendar</h1>
	<p class="mb-5">
		The Calendar is a clickable dispay of the currently selected month. 
	</p>
</div>

<Template let:args>
	<MarginDecorator>
		<Calendar {...args} />
	</MarginDecorator>
</Template>

<Story
	name="Current month"
	args={{ date: new Date() }} />
