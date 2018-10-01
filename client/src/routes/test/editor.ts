import { Macroprocessor } from './../../user/macro';
import { inlineView, autoinject } from "aurelia-framework";
import { DataSource,DataService } from '../../services/datasource';

@inlineView(`
<template>
<require from="../../components/ck-editor"></require>
<div class="col">
<ck-editor value.two-way="text" callback.bind="cb"></ck-editor>
</div>
<div>F: \${finding}</div>
</template>
`)
@autoinject
export class Editor {
  text = "<p>Hello, World</p><p>Goodnight, Sun</p>"
  findings:DataService
  finding

  constructor(private mp: Macroprocessor, private ds:DataSource) {
    this.findings=ds.getService('findings')
    this.findings.on('created',obj=>{
      this.finding=obj
    })
  }
  cb = (text) => {
    return this.mp.process("encounter", text)
  }
}
