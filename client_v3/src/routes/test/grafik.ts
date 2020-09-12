import { inlineView } from "aurelia-framework";

@inlineView(`
  <template>
    <require from="../../components/graph"></require>
    <graph def.bind="definition"></graph> 
  </template>
`)
export class Grafik{
  definition={
    domain_x:[0,10],
    data: [
      {
        title: "Test",
        color: "green",
        axe: "left",
        values: []
      }
    ]
  }

  constructor(){
    for(let i=0;i<10;i++){
      this.definition.data[0].values.push([i,500*Math.random()+100])
    }
  }
}
