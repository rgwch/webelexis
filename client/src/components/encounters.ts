import { bindable } from 'aurelia-framework';
import { inlineView } from 'aurelia-framework';
@inlineView(`
<template>
  <require from="./encounter></require>
  <div virtual-repeat.for="encounter of encounters" infinite-scroll-next="next">
    <encounter id.bind="encounter.id"></encounter>
  </div>
</template>
`)
export class Encounters{
  @bindable patient
  encounters: Array<IEncounter>=[]

  next(topIndex:number,isAtBottom: boolean,isAtTop: boolean){

  }
}
