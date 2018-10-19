import { noView, bindable } from "aurelia-framework";
import {select,selection} from 'd3-selection'
import {scaleLinear} from 'd3-scale'
import {line} from 'd3-shape'
import {axisLeft,axisBottom} from 'd3-axis'
import {extent} from 'd3-array'

@noView
export class Graph{
  @bindable def:{
    domain_x?: number[],      // [lower,upper]
    domain_yl?: number[],     // [lower,upper]
    domain_yr?: number[],     // [lower,upper]
    values: Array<number[]>   // [x,y]
  }
  body:selection
  scaleX: scaleLinear
  scaleYL: scaleLinear
  scaleYR: scaleLinear

  left_offset=30
  right_offset=10
  top_offset=10
  bottom_offset=20

  constructor(public element:Element){

  }
  attached(){
    this.body=select(this.element).append("svg:svg")
    .attr("width","100%")
    .attr("height","85vh")

    const x_domain=this.def.domain_x || extent(this.def.values,d=>d[0])
    const yl_domain=this.def.domain_yl || extent(this.def.values,d=>d[1])

    const sizes=this.body.node().getBoundingClientRect()
    this.scaleX=scaleLinear()
      .domain(x_domain)
      .range([this.left_offset,sizes.width-this.left_offset-this.right_offset])
    this.scaleX.clamp(true)    
    this.scaleYL=scaleLinear()
      .domain(yl_domain)
      .range([sizes.height-this.top_offset-this.bottom_offset,this.bottom_offset])
    this.scaleYL.clamp(true)

    const left_axis=axisLeft(this.scaleYL)
    const x_axis=axisBottom(this.scaleX)

    this.body.append("g")
      .attr("transform",`translate(${this.left_offset},0)`)
      .call(left_axis)
    this.body.append("g")
      .attr("transform",`translate(0,${sizes.height-this.top_offset-this.bottom_offset})`)  
      .call(x_axis)

    this.render(this.def.values)
  }

  render(data){
    this.body.selectAll("circle")
      .data(data)
    .enter().append("circle")
      .attr("cx",d=>{
        return this.scaleX(d[0])
      })
      .attr("cy",d=>{
        let dy=this.scaleYL(d[1])
        return dy
      })
      .attr("r","5px")
      .attr("fill","red")   
  }
}
