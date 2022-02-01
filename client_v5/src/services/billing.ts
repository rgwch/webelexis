import { getService } from "./io";
import type { EncounterType as Konsultation } from "../models/encounter-model";
import { LazyTree } from "../models/tree";

export class Billing {

  async getBillables(): Promise<LazyTree<any> {
    const konsService = getService("konsultation")
    const unbilled:Array<{id:string,patientid:string,fallid:string}> = await konsService.get('unbilled')
    const ret=new LazyTree<any>(null,null,null)
    for(let p of unbilled){
      
    }
    return ret
  }

}
