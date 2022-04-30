<script>
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

<Meta title="Widgets/Flexform" component="{Flexform}" />

<Template let:args>
  <Flexform {...args} />
</Template>

<Story
  name="Lockable"
  args="{{
    ff_cfg: dummy,
    entity: {
      textfield: 'Test',
      date: '20220402',
      number: 42,
      lockable: true,
    },
  }}"
/>
