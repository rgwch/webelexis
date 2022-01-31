import { getService } from "./io";

export class Billing {

  async getBillables(): Promise<Konsultation> {
    const konsService = getService("konsultation")
    const unbilled = await konsService.find({ query: { rechnungsid: 'null' } })

  }

}
