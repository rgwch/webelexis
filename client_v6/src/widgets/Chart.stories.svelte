<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import "../services/i18n/i18n";
  import Chart, { ChartType } from "./Chart.svelte";
  import MarginDecorator from "./MarginDecorator.svelte";
  const def = {
    data: [
      {
        title: "Test data",
        values: [
          ["2020-12-30", 2],
          ["2021-04-01", 4],
          ["2021-05-02", 7],
          ["2021-08-12", 5],
          ["2022-01-12", 4],
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

<Story name="Line" args={{ definition: def, type: ChartType.LINE }} />
<Story name="Dots" args={{ definition: def, type: ChartType.DOT }} />
