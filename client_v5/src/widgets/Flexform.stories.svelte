<script>
import { faAllergies } from "@fortawesome/free-solid-svg-icons";
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import { _ } from "svelte-i18n";
import Flexform from "./Flexform.svelte";

const dummy = {
  title: () => "Testform",
  attributes: [
    {
      attribute: "textfield",
      label: $_("demotest"),
      datatype: "string",
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
    },
  ],
};
</script>

<Meta
  title="Widgets/Flexform"
  component="{Flexform}"
  argTypes="{{ onSave: { action: 'save' }, onLock: { action: 'lock' } }}" />

<Template let:args>
  <Flexform {...args} on:lock="{args.onLock}" on:save="{args.onSave}" />
</Template>

<Story
  name="Lockable"
  args="{{
    ff_cfg: dummy,
    entity: {
      textfield: 'Test',
      date: '20220402',
      number: 42,
    },
    lockable: true,
  }}" />
