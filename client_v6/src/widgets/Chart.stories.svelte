<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import "../services/i18n/i18n";
  import Chart from "./Chart.svelte";
  import MarginDecorator from "./MarginDecorator.svelte";
  const def = {
    data: [
      {
        title: "Test data",
        values: [
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      },
    ],
  };
</script>

<Meta title="Widgets/Chart" component={Chart} />

<div class="bg-gray-100 m-8 p-4 rounded-md border border-blue-500 w-1/2">
  <h1 class="font-bold text-lg">Chart</h1>
  <p class="mb-5">The Chart is a graphical display of data.</p>
</div>

<Template let:args>
  <MarginDecorator>
    <Chart {...args} />
  </MarginDecorator>
</Template>

<Story name="Line" args={{ definition: def }} />
