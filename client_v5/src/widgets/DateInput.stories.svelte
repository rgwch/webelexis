<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import "../services/i18n/i18n";
import DateInput from "./DateInput.svelte";
import MarginDecorator from "./MarginDecorator.svelte";
</script>

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
  <h1 class="font-bold text-lg">DateInput</h1>
  <p class="mb-5">A Label and a Datepicker.</p>
  <p>Sends 'dateChanged' event if new date selected</p>
</div>

<Meta
  title="Form-Inputs/DateInput"
  component="{DateInput}"
  argTypes="{{ onDateChanged: { action: 'dateChanged' } }}"
/>

<Template let:args>
  <MarginDecorator>
    <DateInput {...args} on:dateChanged="{args.onDateChanged}" />
  </MarginDecorator>
</Template>

<Story
  name="enabled"
  args="{{ dateString: '20200501', label: 'A datepicker' }}"
/>

<Story
  name="disabled"
  args="{{ dateString: '20200501', label: 'A datepicker', disabled: true }}"
/>
