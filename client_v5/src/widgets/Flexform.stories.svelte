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
      },
    ],
  };
</script>

<Meta title="WIdgets/Flexform" component={Flexform} />

<Template let:args>
  <Flexform {...args} />
</Template>

<Story
  name="Rechnungen"
  args={{ ff_cfg: dummy, entity: { textfield: "Test" } }}
/>
