/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2023 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { Extension, InputRule, textInputRule, type CanCommands, type ChainedCommands, type ExtendedRegExpMatchArray, type SingleCommands, type Range } from '@tiptap/core'
import type { EditorState, Transaction } from 'prosemirror-state'

import macros from '../user/macrodefs'
export interface MacrosOptions {
  activate: true
}

const macroHandler = (props: {
  state: EditorState, range: Range, match: ExtendedRegExpMatchArray,
  commands: SingleCommands, chain: () => ChainedCommands, can: () => CanCommands
}) => {
  const state: EditorState = props.state
  const match: ExtendedRegExpMatchArray = props.match
  const range: Range = props.range
  const macroname = match[1]
  let replacement = ""
  for (const ma of macros) {
    const exec = ma.match.exec(macroname)
    if (exec) {
      replacement = ma.func(exec, macroname)
      break;
    }
  }
  let tr: Transaction = state.tr
  tr.deleteRange(range.from, range.to);
  tr.insertText(replacement)
  let newState = state.apply(tr)
}

const textMacro = new InputRule({
  find: /(.[^\s]+)\$$/,
  handler: macroHandler
})

export const Macros = Extension.create<MacrosOptions>({
  name: "macros",
  addInputRules() {
    const rules = [textMacro]
    return rules
  },

  onTransaction({ transaction }) {
    //alert(JSON.stringify(transaction))
    //transaction.insertText("whoo")
  },
  renderHTML({ attribs }) {
    return ['h1', attribs, 0]
  }
})
