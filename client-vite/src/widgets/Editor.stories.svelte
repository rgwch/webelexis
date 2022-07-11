<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import { _ } from "svelte-i18n";
import Editor from "./Editor.svelte";
import MarginDecorator from "./MarginDecorator.svelte";
</script>

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
  <h1 class="font-bold text-lg">Editor</h1>
  <p class="mb-5">A simple MarkDown-Editor</p>
</div>
<Meta title="Widgets/Editor" component="{Editor}" />

<Template let:args>
  <MarginDecorator>
    <Editor class="border-1" {...args} />
  </MarginDecorator>
</Template>

<Story name="Plain" />
