import { noView, bindable } from "aurelia-framework";
import {select,selection} from 'd3-selection'
import {scaleLinear} from 'd3-scale'
import {line} from 'd3-shape'

@noView
export class Graph{
  @bindable def:{
    domain_x: {lower:number,upper:number},
    domain_yl: {lower:number,upper:number},
    domain_yr?: {lower:number,upper:number},
    values: Array<{x:number,y:number}>
  }
  body:selection
  scaleX: scaleLinear
  scaleYL: scaleLinear
  scaleYR: scaleLinear

  left_offset=20
  right_offset=10
  top_offset=10
  bottom_offset=20

  constructor(public element:Element){

  }
  attached(){
    this.body=select(this.element).append("svg:svg")
    .attr("width","100%")
    .attr("height","85vh")
  
    const sizes=this.body.node().getBoundingClientRect()
    this.scaleX=scaleLinear()
      .domain([this.def.domain_x.lower,this.def.domain_x.upper])
      .range([this.left_offset,sizes.width-this.left_offset-this.right_offset])
    this.scaleX.clamp(true)    
    this.scaleYL=scaleLinear()
      .domain([this.def.domain_yl.lower,this.def.domain_yl.upper])
      .range([sizes.height-this.top_offset-this.bottom_offset,this.bottom_offset])
    this.scaleYL.clamp(true)
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
