/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from '../webelexisevents';
import { autoinject } from 'aurelia-framework';
import { FindingsManager } from 'models/findings-model';
import macros from '../user/macrodefs'

/**
 * Instead od simple mappings from shortcuts to texts we chose a more powerful approach:
 * The Macroprocessor is a class with functions to process keyboard inputs.
 * The API is not stable yet.
 */
@autoinject
export class Macroprocessor {
  constructor(private we: WebelexisEvents, private findings: FindingsManager) {
  }
  /**
   * process a keyword.
   * @param context either an encounter or a document
   * @param word the last word the user typed before hitting the macro key.
   * @return the expansion for this macro (can be a finding or a billing)
   */
  process(context: "encounter" | "document", word: string) {
    if (context === 'encounter') {
      for (const m of macros) {
        const matched = m.match.exec(word)
        if (matched) {
          return m.func(matched, word, this.findings)
        }
      }
    } else if (context === 'document') {

    }
    return word
  }

}
