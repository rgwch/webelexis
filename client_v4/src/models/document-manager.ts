import { IElexisType } from './elexistype';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { ObjectManager } from './object-manager';

export interface IDocument extends IElexisType{
  concern: string;
  title: string;
  "Content-Type": string;
  date: string;
  Lucinda_ImportedAt?: string;
  lastname?: string;
  firstname?: string;
  birthdate?: string

}

export class DocumentManager extends ObjectManager{
  constructor(){
    super("lucinda")
  }

}
