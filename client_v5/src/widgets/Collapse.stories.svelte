<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import "../services/i18n/i18n";
import Collapse from "./Collapse.svelte";
import MarginDecorator from "./MarginDecorator.svelte";
</script>

<Meta title="Widgets/Collapse" component="{Collapse}" />

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
  <h1 class="font-bold text-lg">Calendar</h1>
  <p class="mb-5">The Collapse is a collapsible component.</p>
</div>

<Template let:args>
  <MarginDecorator>
    <Collapse {...args} />
  </MarginDecorator>
</Template>

<Story name="Default" args="{{ title: 'Click me' }}">
  <div slot="body">Hoho</div>
</Story>
