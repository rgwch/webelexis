<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import "../services/i18n/i18n";
import Badge from "./Badge.svelte";
import MarginDecorator from "./MarginDecorator.svelte";
</script>

<Meta title="Widgets/Badge" component="{Badge}" />

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500 w-1/2">
  <h1 class="font-bold text-lg">Badge</h1>
  <p class="mb-5">
    A Badge is a small element to display some short informations
  </p>
</div>

<Template let:args>
  <MarginDecorator>
    <Badge {...args} />
  </MarginDecorator>
</Template>

<Story name="Default" args="{{ text: 'Hi!', type: 'info' }}" />

<Story name="Warn" args="{{ text: '99!', type: 'warn' }}" />
