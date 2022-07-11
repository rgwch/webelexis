<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import "../services/i18n/i18n";
import LineInput from "./LineInput.svelte";
import MarginDecorator from "./MarginDecorator.svelte";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const validate = (val) => val.length > 2;
</script>

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
  <h1 class="font-bold text-lg">LineInput</h1>
  <p class="mb-5">Enter a line of text.</p>
  <p>Sends 'textChanged' event if new Text entered</p>
</div>

<Meta
  title="Form-Inputs/LineInput"
  component="{LineInput}"
  argTypes="{{ onTextChanged: { action: 'textChanged' } }}" />

<Template let:args>
  <MarginDecorator>
    <LineInput {...args} on:textChanged="{args.onTextChanged}" />
  </MarginDecorator>
</Template>

<Story
  name="enabled"
  args="{{
    value: '',
    label: 'Enter less than 3 chars for error',
    validate,
    errmsg: 'Must enter 3 or more chars',
  }}" />

<Story
  name="disabled"
  args="{{ value: 'disable', label: "can't change", disabled: true }}" />

<Story
  name="with Button icon"
  args="{{
    value: '',
    label: 'Enter less than 3 chars for error',
    validate,
    errmsg: 'Must enter 3 or more chars',
    buttonIcon: faMagnifyingGlass,
  }}" />

<Story
  name="with Button text"
  args="{{
    value: '',
    label: 'Enter less than 3 chars for error',
    validate,
    errmsg: 'Must enter 3 or more chars',
    buttonText: 'Suche',
  }}" />

<Story
  name="with icon and text"
  args="{{
    value: '',
    label: 'Enter less than 3 chars for error',
    validate,
    errmsg: 'Must enter 3 or more chars',
    buttonIcon: faMagnifyingGlass,
    buttonText: 'Suche',
  }}" />
