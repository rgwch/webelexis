<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { _ } from "svelte-i18n";
  import Flexform from "./Flexform.svelte";
  import MarginDecorator from "./MarginDecorator.svelte";

  const dummy = {
    title: () => "Testform",
    attributes: [
      {
        attribute: "textfield",
        label: $_("demotest"),
        datatype: "string",
        sizehint:2
      },
      {
        attribute: "date",
        datatype: "date",
        label: "Date",
      
      },
      {
        attribute: "number",
        datatype: "number",
        label: "Number field",
        sizehint:4
      },
      {
        attribute:"long",
        datatype: "string",
        label: "Text",
        sizehint:4
      }
    ],
  };
</script>

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
  <h1 class="font-bold text-lg">Flexform</h1>
  <p class="mb-5">
    A Component for display and edit complex structures from a
    Flexform-definition
  </p>
</div>

<Meta
  title="Widgets/Flexform"
  component={Flexform}
  argTypes={{ onSave: { action: "save" }, onLock: { action: "lock" } }}
/>

<Template let:args>
  <MarginDecorator>
    <Flexform {...args} on:lock={args.onLock} on:save={args.onSave} />
  </MarginDecorator>
</Template>

<Story
  name="Lockable"
  args={{
    ff_cfg: dummy,
    entity: {
      textfield: "Test",
      date: "20220402",
      number: 42,
      long: "a quite long string"
    },
    lockable: true,
  }}
/>
