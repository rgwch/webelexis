<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import "../services/i18n/i18n";
import Card from "./Card.svelte";
import MarginDecorator from "./MarginDecorator.svelte";
</script>

<Meta title="Widgets/Card" component="{Card}" />

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500 w-1/2">
  <h1 class="font-bold text-lg">Card</h1>
  <p class="mb-5">The Card is a component with header and body.</p>
</div>

<Template let:args>
  <MarginDecorator>
    <Card {...args} />
  </MarginDecorator>
</Template>

<Story
  name="Default header and body"
  args="{{ title: 'Hi there', contents: "I'm a Card!" }}" />

<Story name="custom body" args="{{ title: 'Hi there' }}">
  <div slot="heading">
    <div class="bg-green-300 text-purple-700">I'm a custom heading</div>
  </div>
  <div slot="body">
    <div class="bg-yellow-400 text-red-500">I'm a custom body!</div>
  </div>
</Story>
