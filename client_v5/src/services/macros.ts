/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { Extension, textInputRule } from '@tiptap/core'

export interface MacrosOptions {
  activate: true
}

export const dummy = textInputRule({
  find: /\$/,
  replace: "schwupps"
})

export const Macros = Extension.create<MacrosOptions>({
  name: "macros",
  addInputRules() {
    const rules = [dummy]
    return rules
  },
  onTransaction({ transaction }) {
    // alert(JSON.stringify(transaction))
  },
  renderHTML({ attribs }) {
    return ['h1', attribs, 0]
  }
})
