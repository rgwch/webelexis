<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import "../services/i18n/i18n";
    import Dropdown from "./Dropdown.svelte";
    
    import MarginDecorator from "./MarginDecorator.svelte";
    const  items=["one","two","three"]
    </script>
    
    <Meta
      title="Widgets/Dropdown"
      component="{Dropdown}"
      argTypes="{{ onSelect: { action: 'select' } }}" />
    
    <div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
      <h1 class="font-bold text-lg">Dropdown</h1>
      <p class="mb-5">
        The Dropdown
      </p>
      <p>Sends 'select' event if new item selected</p>
    </div>
    
    <Template let:args>
      <MarginDecorator>
        <Dropdown {...args} on:select="{args.onSelect}" />
      </MarginDecorator>
    </Template>
    
    <Story name="without label" args="{{ elements: items}}" />
    <Story name="with label" args="{{ elements: items, label: 'The Label' }}" />
    