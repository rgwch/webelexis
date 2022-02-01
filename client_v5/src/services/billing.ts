import { getService } from "./io";
import type { EncounterType as Konsultation } from "../models/encounter-model";

export class Billing {

  async getBillables(): Promise<Konsultation> {
    const konsService = getService("konsultation")
    const unbilled = await konsService.get('unbilled')
    return unbilled
  }

}
