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
    values :[]
  }

  constructor(){
    for(let i=0;i<10;i++){
      this.definition.values.push([i,500*Math.random()+100])
    }
  }
}
