<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import "../services/i18n/i18n";
import Dropdown from "./Dropdown.svelte";

import MarginDecorator from "./MarginDecorator.svelte";
const items = ["one", "two", "three"];
</script>

<Meta
  title="Widgets/Dropdown"
  component="{Dropdown}"
  argTypes="{{ onChanged: { action: 'changed' } }}" />

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
  <h1 class="font-bold text-lg">Dropdown</h1>
  <p class="mb-5">The Dropdown displays a list of strings to select from.</p>
  <p>Sends 'select' event if an item was selected</p>
</div>

<Template let:args>
  <MarginDecorator>
    <Dropdown {...args} on:changed="{args.onChanged}" />
  </MarginDecorator>
</Template>

<Story name="without label" args="{{ elements: items, selected: 'two' }}" />
<Story name="with label" args="{{ elements: items, label: 'The Label' }}" />
