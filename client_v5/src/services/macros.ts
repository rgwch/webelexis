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
