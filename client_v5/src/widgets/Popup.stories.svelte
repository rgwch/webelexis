<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import "../services/i18n/i18n";
    import Popup from "./Popup.svelte";
    
    import MarginDecorator from "./MarginDecorator.svelte";
    const items = ["one", "two", "three"];
    </script>
    
    <Meta
      title="Widgets/Popup"
      component="{Popup}"
      argTypes="{{
        onSelected: { action: 'selected' },
      }}" />
    
    <div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500">
      <h1 class="font-bold text-lg">Popup</h1>
      <p class="mb-5">
        A Popup Menu
      </p>
    </div>
    
    <Template let:args>
      <MarginDecorator>
        <Popup {...args} on:selected="{args.onSelected}" />
      </MarginDecorator>
    </Template>
    
    <Story name="default" args="{{ items}}" />
    