<script lang="ts" context="module">
  /**
   * universal chart display. Create a ChartDefinition  and bind this to the Graph Component.
   * Note: X-coordimates should be dates. If domains are not given, they are calculated from the data.
   * data-values: Each datapoint is a 2-element array with x and y coordinates
   */
  export interface ChartDefinition {
    domain_x?: number[]; // [lower,upper]
    domain_yl?: number[]; // [lower,upper]
    domain_yr?: number[]; // [lower,upper]
    //values: Array<any[]>     // [x,y1[,y2...][,yr]]
    data: Array<{
      title: string; // Title for the legend
      color?: string; // Display color (defaults to blue)
      axe?: "left" | "right"; // which axe to bind
      values: Array<any[]>; // [x,y]
    }>;
  }
</script>

<script lang="ts">
  import { select, selection } from "d3-selection";
  import type { scaleLinear, scaleTime } from "d3-scale";
  import { line } from "d3-shape";
  import { timeFormat } from "d3-time-format";
  import { axisLeft, axisBottom, axisRight } from "d3-axis";
  import { extent } from "d3-array";
  import { onMount } from "svelte";
  import { watchResize } from "svelte-watch-resize";
  export let definition: ChartDefinition;
  let x_values = [],
    yl_values = [],
    yr_values = [];
  for (const d of definition.data) {
    if (d.axe == undefined) {
      d.axe = "left";
    }
    if (d.color == undefined) {
      d.color = "blue";
    }
    x_values = x_values.concat(d.values);
    if (d.axe === "left") {
      yl_values = yl_values.concat(d.values);
    } else if (d.axe === "right") {
      yr_values = yr_values.concat(d.values);
    } else {
      throw "bad axe definition in graph";
    }
  }
  const x_domain =
    definition.domain_x || extent(x_values, (d) => new Date(d[0]));
  const yl_domain = definition.domain_yl || extent(yl_values, (d) => d[1]);

  let scaleYL: scaleLinear;
  let scaleYR: scaleLinear;
  let sizes;
  const margin = { left: 30, right: 10, top: 10, bottom: 40 };
  let frame: Element;
  function resize() {
    sizes = frame.getBoundingClientRect();
  }
  onMount(() => {
    sizes = frame.getBoundingClientRect();
  });
</script>

<template>
  <h1>{definition.data[0].title}</h1>
  <p>{sizes?.left}.{sizes?.right}</p>
  <div
    bind:this={frame}
    id="frame"
    class="w-100% bg-gray-100"
    use:watchResize={resize}
  >
    <svg />
  </div>
</template>
