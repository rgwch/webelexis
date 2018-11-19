import { WebelexisEvents } from 'webelexisevents';
import { Macroprocessor } from '../../services/macro';
import { inlineView, autoinject } from "aurelia-framework";
import { DataSource, DataService } from '../../services/datasource';

@inlineView(`
<template>
<require from="components/ck-editor"></require>
<require from="views/findings-view"></require>
<div class="col">
<ck-editor value.two-way="text" callback.bind="cb"></ck-editor>
</div>
<div>F: \${JSON.stringify(finding)}</div>
<findings-view></findings-view>
</template>
`)
@autoinject
export class Editor {
  text = "<p>Hello, World</p><p>Goodnight, Sun</p>"
  findings: DataService
  finding

  constructor(private mp: Macroprocessor, private ds: DataSource, private we: WebelexisEvents) {
    this.findings = ds.getService('findings')
    this.findings.on('created', obj => {
      this.finding = obj
    })
  }
  cb = (text) => {
    const encounter = this.we.getSelectedItem('konsultation')
    try {
      return this.mp.process(encounter, text)
    } catch (err) {
      alert(err)
    }
  }
}
