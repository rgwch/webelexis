import cfg from '../services/properties'
import { type Invoice, InvoiceState } from '../models/invoice'

export async function getBills(criteria): Promise<Array<Invoice>>{
    const res=await fetch(cfg.server+"/billing/load",{
        method:"post",
        body: JSON.stringify(criteria)
    })
    if(res.ok){
        return await res.json()
    }else{
        alert(res.status)
        return []
    }
}

export function getOpenBills() : Promise<Array<Invoice>>{
    const criteria={
        rnstatus: InvoiceState.OPEN_AND_PRINTED,
        $limit:1
    }
    return getBills(criteria)
}
