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

  export enum ChartType {
    LINE,
    DOT,
    BAR,
  }
</script>

<script lang="ts">
  import { select, selection } from "d3-selection";
  import { scaleLinear, scaleTime } from "d3-scale";
  import { line } from "d3-shape";
  import { timeFormat } from "d3-time-format";
  import { axisLeft, axisBottom, axisRight } from "d3-axis";
  import { extent } from "d3-array";
  import { onMount } from "svelte";

  export let definition: ChartDefinition;
  export let type: ChartType = ChartType.LINE;
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
  const dateFormat = timeFormat("%d.%m.%Y");
  const x_domain =
    definition.domain_x ?? extent(x_values, (d) => new Date(d[0]));
  const yl_domain = definition.domain_yl || extent(yl_values, (d) => d[1]);

  let scaleYL: scaleLinear;
  let scaleYR: scaleLinear;
  let scaleX: scaleTime;
  let sizes = { left: 0, top: 0, right: 400, bottom: 300 };

  const margin = { left: 30, right: 30, top: 10, bottom: 40 };
  let frame: Element;

  function resize() {
    select(frame).html(null);
    sizes = frame.getBoundingClientRect();
    const yranges = [sizes.bottom - margin.bottom - margin.top, margin.top];
    if (yr_values.length > 0) {
      margin.right += 30;
    }

    scaleYL = scaleLinear().domain(yl_domain).range(yranges).clamp(true);
    scaleX = scaleTime()
      .domain(x_domain)
      .range([margin.left, sizes.right - margin.left - margin.right])
      .clamp(true);

    scaleYR = scaleLinear()
      .domain(definition.domain_yr || extent(yr_values, (d) => d[1]))
      .range(yranges)
      .clamp(true);

    // create chart axes
    const left_axis = axisLeft(scaleYL);
    const x_axis = axisBottom(scaleX).tickFormat(dateFormat);
    const svg = select(frame)
      .append("svg")
      .attr("width", sizes.right)
      .attr("height", sizes.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(left_axis);

    svg
      .append("g")
      .attr(
        "transform",
        `translate(0,${sizes.bottom - margin.top - margin.bottom})`
      )
      .call(x_axis)
      .selectAll("text") // rotate labels by 35° so they don't interfere
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-35)");
    // create right Y axe only, if data for two axes are present.
    if (yr_values.length > 0) {
      const right_axis = axisRight(scaleYR);
      svg
        .append("g")
        .attr("transform", `translate(${sizes.right - margin.right},0)`)
        .call(right_axis);
    }
    for (const chart of definition.data) {
      const layer = svg.append("g");
      drawLayer(chart, layer, type);
    }
  }

  function drawLayer(chart, canvas, type: ChartType) {
    switch (type) {
      case ChartType.DOT:
        canvas
          .selectAll("circle")
          .data(chart.values)
          .enter()
          .append("circle")
          .attr("cx", (d) => {
            return scaleX(new Date(d[0]));
          })
          .attr("cy", (d) => {
            let dy = chart.axe == "right" ? scaleYR(d[1]) : scaleYL(d[1]);
            return dy;
          })
          .attr("r", "5px")
          .attr("fill", chart.color);
        break;
      case ChartType.LINE:
        canvas
          .append("path")
          .datum(chart.values)
          .attr(
            "d",
            line()
              .x((d) => scaleX(new Date(d[0])))
              .y((d) => scaleYL(d[1]))
          )
          .attr("stroke", chart.color);
    }
  }
  onMount(() => {
    resize();
    window.addEventListener("resize", resize);
  });
</script>

<template>
  <h1>{definition.data[0].title}</h1>
  <p>{sizes?.left}-{sizes?.right},{sizes?.top}-{sizes?.bottom}.</p>
  <div bind:this={frame} id="frame" class="bg-gray-300 h-auto" />
</template>
