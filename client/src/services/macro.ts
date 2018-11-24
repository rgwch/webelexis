/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from '../webelexisevents';
import { autoinject } from 'aurelia-framework';
import { FindingsManager } from 'models/findings-model';
import macros from '../user/macrodefs'
import { EncounterType } from 'models/encounter';
import { BillingsManager } from 'models/billings-model';
import { ElexisType } from './../models/elexistype';
import { LeistungsblockManager } from './../models/leistungsblock-model';

/**
 * Instead od simple mappings from shortcuts to texts we chose a more powerful approach:
 * The Macroprocessor is a class with functions to process keyboard inputs.
 * The API is not stable yet.
 */
@autoinject
export class Macroprocessor {
  constructor(private we: WebelexisEvents, private findings: FindingsManager, 
    private lb: LeistungsblockManager, private bm:BillingsManager) {
  }
  /**
   * process a keyword.
   * @param context either an encounter or a document
   * @param word the last word the user typed before hitting the macro key.
   * @return the expansion for this macro (can be a finding or a billing)
   */
  process(context: ElexisType, word: string) {
    if (context.type === 'konsultation') {
      for (const m of macros) {
        const matched = m.match.exec(word)
        if (matched) {
          return m.func(matched, word, this.findings)
        }
      }
      // if no user-supplied macro matches, try billing blocks
      this.lb.findBlock(word).then(async block => {
        if (block) {
          const others=await this.bm.getBillings(<EncounterType>context)
          this.lb.createBillings(block, <EncounterType>context,others)
        }
      })
      return ""
    } else if (context.type === 'document') {

    }
    return word
  }

}
