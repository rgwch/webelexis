<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Test from "./Test.svelte";
 </script>

<Meta title="Test" component={Test} />

<Template let:args>
  <Test {...args} />
</Template>

<Story name="Yellow" args={{ title: "Test in Storybook: Yellow",color:"text-yellow-600" }} />
<Story name="Red" args={{ title: "Test in Storybook: Red",color:"text-red-800" }} />
