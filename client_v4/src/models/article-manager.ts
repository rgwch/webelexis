import { IElexisType, ELEXISDATE } from './elexistype';
import { ObjectManager } from './object-manager';

export interface IArticle extends IElexisType{
  subid?: string
  dscr: string
  gtin: string
  maxbestand: number
  minbestand: number
  istbestand: number
  pexf: number
  ppub: number
  type: "3" | "N" | "P" | "X"
  bb: 0 | 2 | 9
  phar: string
  codeclass: string
  extid: string
  extjson?: any
  klasse?: string
  atc: string
  validfrom: ELEXISDATE
  validto: ELEXISDATE
}

export class ArticleManager extends ObjectManager{
  constructor(){
    super('article')
  }


  getLabel(art:IArticle){
    return art.dscr
  }
}
