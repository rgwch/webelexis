import type { ElexisType } from "./elexistype";
import { ObjectManager } from "./object-manager";

export interface DiagnoseType extends ElexisType {
    dg_txt: string
    dg_code: string
    klasse: string
}

export class DiagnoseManager extends ObjectManager {
    constructor() {
        super("diagnose")
    }
    public async findForKons(konsid: string): Promise<Array<DiagnoseType>> {
        const diags = await super.find({ query: { konsid } })
        return diags.data
    }
}


