import { LogManager } from 'aurelia-framework';
import { StickynoteManager, IStickyNote } from './../models/stickynote-manager';
import { IPatient } from './../models/patient-model';
import { inlineView, bindable } from 'aurelia-framework';
import { IQueryResult } from 'services/dataservice';
import { IEditorCommand } from './editor'
import Delta from 'quill-delta'

const log=LogManager.getLogger("Stickynotes")

@inlineView(`
<template>
  <require from="./editor"></require>
  <!-- div class="stickynotes" innerhtml.bind="notetext"></div -->
  <editor config.bind="edconfig"></editor>
</template>
`)
export class Notes {
  @bindable patient: IPatient
  actnote: IStickyNote

  edconfig = {

    callback: this.editorChanged,
    commands: cmd => { this.editorcommand = cmd }
  }
  editorcommand: (cmd: IEditorCommand) => void = null

  constructor(private stm: StickynoteManager) { }

  editorChanged(newText: Delta) {
    this.actnote.delta=newText
    this.stm.save(this.actnote)
  }

  patientChanged(newp, oldp) {
    this.stm.find({ patientid: newp.id }).then((sn: IQueryResult<IStickyNote>) => {
      if (sn.total > 0) {
        this.actnote=sn.data[0]
        const notetext = sn.data[0].delta
        if (this.editorcommand) {
          this.editorcommand({ mode: 'replace', from: 0, data: notetext })
        }
      }
    })
  }

}
