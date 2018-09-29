/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import {KontaktType, Kontakt} from './kontakt'

/**
 * An Elexis "Termin"
 */
export interface TerminType{
    ID:string,
    PadID: string,
    Tag: string,
    Beginn: string,
    Dauer: string,
    Grund: string,
    TerminTyp: string,
    TerminStatus: string,
    kontakt: KontaktType

}

export class Termin{

  public static getKontakt=(raw:TerminType):KontaktType=>raw.kontakt || <KontaktType>{Bezeichnung1:"-"}

  public static getLabel=(raw:TerminType):string=>Kontakt.getLabel(Termin.getKontakt(raw))

}
