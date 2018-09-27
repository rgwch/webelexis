import {DateTime} from '../services/datetime'
import {autoinject} from 'aurelia-framework'
import {Container} from 'aurelia-framework'
import {AddressType} from './address'
import {ElexisType} from './elexistype'
import {MailType} from './mail'


export interface KontaktType extends ElexisType{
    ID:string,
    Bezeichnung1: string,
    Bezeichnung2?: string,
    Bezeichnung3?: string,
    geburtsdatum?: string,
    geschlecht: "m" | "f" | "w",
    adressen?: [AddressType],
    mails?: [MailType]
}


export class Kontakt{

  private static dt=Container.instance.get(DateTime)

  public static getLabel=(raw:KontaktType)=>{
    let d=raw.geburtsdatum || ""
    if(d.length==8){
      d=Kontakt.dt.toDate(d)
    }
    let ret= raw.Bezeichnung1+" "+(raw.Bezeichnung2 || "")
    if(raw.geschlecht){
      ret+=`(${raw.geschlecht})`
    }
    if(d){
      ret+=", "+d
    }
    return ret
  }
}
