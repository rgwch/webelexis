<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { _ } from "svelte-i18n";
  import Kv from "./KeyValueDisplay.svelte";
  import MarginDecorator from "./MarginDecorator.svelte";

  const dummy = {
    one: "Eins",
    two: "Zwei",
    three: "Drei",
    four: "Vier",
    five: "Fünf",
    six: "Sechs",
    seven: "Sieben",
    eight: "Acht",
    nine: "Neun",
    ten: "Zehn",
  };
</script>

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
  <h1 class="font-bold text-lg">KeyValueDisplay</h1>
  <p class="mb-5">
    A Component to display and edit simple string-string Objects
  </p>
</div>

<Meta
  title="Widgets/KeyValueDisplay"
  component={Kv}
  argTypes={{ onSave: { action: "save" }, onLock: { action: "lock" } }}
/>

<Template let:args>
  <MarginDecorator>
    <Kv {...args} on:lock={args.onLock} on:save={args.onSave} />
  </MarginDecorator>
</Template>

<Story
  name="standard"
  args={{
    obj: dummy,
    keys: ["twelve","twenty"]
  }}
/>
