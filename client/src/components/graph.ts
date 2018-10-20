import { noView, bindable } from "aurelia-framework";
import { select, selection } from 'd3-selection'
import { scaleLinear, scaleTime } from 'd3-scale'
import { line } from 'd3-shape'
import { timeFormat } from 'd3-time-format'
import { axisLeft, axisBottom, axisRight } from 'd3-axis'
import { extent } from 'd3-array'
import { extend } from "webdriver-js-extender";

export interface ChartDefinition {
  domain_x?: number[],        // [lower,upper]
  domain_yl?: number[],     // [lower,upper]
  domain_yr?: number[],     // [lower,upper]
  //values: Array<any[]>     // [x,y1[,y2...][,yr]]
  data: Array<{
    title: string
    color?: string
    axe?: "left" | "right"
    values: Array<any[]>    // [x,y]
  }

  >
}

@noView
export class Graph {
  @bindable def: ChartDefinition
  body: selection
  scaleX: scaleTime
  scaleYL: scaleLinear
  scaleYR: scaleLinear

  left_offset = 30
  right_offset = 10
  top_offset = 10
  bottom_offset = 20

  dateFormat = timeFormat("%d.%m.%Y")

  constructor(public element: Element) {

  }
  attached() {
    this.body = select(this.element).append("svg:svg")
      .attr("width", "100%")
      .attr("height", "85vh")
    let x_values = [], yl_values = [], yr_values = []
    for (const d of this.def.data) {
      if(d.axe== undefined){
        d.axe="left"
      }
      if(d.color== undefined){
        d.color="blue"
      }
      x_values = x_values.concat(d.values)
      if (d.axe === "left") {
        yl_values = yl_values.concat(d.values)
      } else if (d.axe === "right") {
        yr_values = yr_values.concat(d.values)
      } else {
        throw "bad axe definition in graph"
      }
    }
    // if domains for the scales are not predefined, calculate them from data
    const x_domain = this.def.domain_x || extent(x_values, d => new Date(d[0]))
    const yl_domain = this.def.domain_yl || extent(yl_values, d => d[1])

    const sizes = this.body.node().getBoundingClientRect()
    this.scaleX = scaleTime()
      .domain(x_domain)
      .range([this.left_offset, sizes.width - this.left_offset - this.right_offset])
    this.scaleX.clamp(true)
    this.scaleYL = scaleLinear()
      .domain(yl_domain)
      .range([sizes.height - this.top_offset - this.bottom_offset, this.bottom_offset])
    this.scaleYL.clamp(true)
    this.scaleYR = scaleLinear()
      .domain(this.def.domain_yr || extent(yr_values, d => d[1]))
      .range([sizes.height - this.top_offset - this.bottom_offset, this.bottom_offset])

    const left_axis = axisLeft(this.scaleYL)
    const x_axis = axisBottom(this.scaleX)
      .tickFormat(this.dateFormat)

    this.body.append("g")
      .attr("transform", `translate(${this.left_offset},0)`)
      .call(left_axis)
    this.body.append("g")
      .attr("transform", `translate(0,${sizes.height - this.top_offset - this.bottom_offset})`)
      .call(x_axis)

    if (yr_values.length > 0) {
      const right_axis = axisRight(this.scaleYR)
      this.body.append("g")
        .attr("transform", `translate(${sizes.width - this.right_offset},0)`)
        .call(right_axis)
    }

    this.render(this.def.data)
  }

  render(data) {
    for(const chart of data){
      const layer=this.body.append("g")
      this.drawLayer(chart,layer)
    }
  }
  drawLayer(chart,canvas){
    canvas.selectAll("circle")
      .data(chart.values)
      .enter().append("circle")
      .attr("cx", d => {
        return this.scaleX(new Date(d[0]))
      })
      .attr("cy", d => {
        let dy = this.scaleYL(d[1])
        return dy
      })
      .attr("r", "5px")
      .attr("fill", chart.color)
  }
}
