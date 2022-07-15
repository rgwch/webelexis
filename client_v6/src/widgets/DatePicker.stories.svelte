<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import "../services/i18n/i18n";
import DatePicker from "./DatePicker.svelte";

import MarginDecorator from "./MarginDecorator.svelte";
</script>

<Meta
  title="Widgets/DatePicker"
  component="{DatePicker}"
  argTypes="{{ onSelect: { action: 'select' } }}" />

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
  <h1 class="font-bold text-lg">Datepicker</h1>
  <p class="mb-5">
    The Datepicker is a clickable dispay of the currently selected date as a
    localized string. On click, opens a Calendar component to select a date. If
    disabled, shows currently selected date only.
  </p>
  <p>Sends 'select' event if new date selected</p>
</div>

<Template let:args>
  <MarginDecorator>
    <DatePicker {...args} on:select="{args.onSelect}" />
  </MarginDecorator>
</Template>

<Story name="enabled" args="{{ current: new Date() }}" />
<Story name="disabled" args="{{ current: new Date(), disabled: true }}" />
<Story name="with label" args="{{ current: new Date(), label: 'The Label' }}" />
