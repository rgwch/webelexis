<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import "../services/i18n/i18n";
import TextInput from "./TextInput.svelte";
import MarginDecorator from "./MarginDecorator.svelte";

const validate = (val) => val.length > 2;
</script>

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
  <h1 class="font-bold text-lg">DateInput</h1>
  <p class="mb-5">A LineInput.</p>
  <p>Sends 'textChanged' event if new Text entered</p>
</div>

<Meta
  title="Form-Inputs/TextInput"
  component="{TextInput}"
  argTypes="{{ onTextChanged: { action: 'textChanged' } }}" />

<Template let:args>
  <MarginDecorator>
    <TextInput {...args} on:textChanged="{args.onTextChanged}" />
  </MarginDecorator>
</Template>

<Story
  name="enabled"
  args="{{
    value: '',
    label: 'A multiline text field',
  }}" />

<Story
  name="disabled"
  args="{{ value: 'disable', label: "can't change", disabled: true }}" />
