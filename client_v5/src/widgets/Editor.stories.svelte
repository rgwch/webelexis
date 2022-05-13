<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import { _ } from "svelte-i18n";
import Editor from "./Editor.svelte";
</script>

<Meta title="Widgets/Editor" component="{Editor}" />

<Template let:args>
  <Editor class="border-1" {...args} />
</Template>

<Story name="Plain" />
