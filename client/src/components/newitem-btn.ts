/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { inlineView, bindable } from "aurelia-framework";

/**
 * The button to create a new item
 */
@inlineView(`
<template>
  <button type="button" class="btn" disabled.bind="disabled">
    <i class="fas fa-asterisk createbutton"></i>
  </button>
</template>
`)
export class NewItemButton{

  @bindable disabled:boolean=false

}
