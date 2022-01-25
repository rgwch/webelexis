// const cfg =require ('./config.js')
// const {createBill}= require('./invoice/billing.js')
const logger = require('../logger')

const base = '/billing/'

module.exports = (app) => {
  app
    .get(base, (req, res) => {
      res.json({ status: 'billing is active' })
    })

    .get(base + 'load', async (req, res) => {
      const status = req.query.status || 4
      const fromDate = req.query.datum
      const billService = app.service('bills')
      const result = await billService.find({
        query: {
          rndatum: fromDate,
          rnstatus: status,
          $limit: 1,
        },
      })
      const hydrated = await Promise.all(
        result.data.map((bill) => hydrate(bill, billService)),
      )

      res.json(hydrated)
    })
    .post(base + 'load', async (req, res) => {
      const q = req.body
      q.deleted = 0
      const billService = app.service('bills')
      const result = await billService.find({ query: q })
      const hydrated = await Promise.all(
        result.map((bill) => hydrate(bill, billService)),
      )
      res.json(hydrated)
    })
    .get(base + 'print/:nr', async (req, res) => {
      const nr = req.params.nr
      if (nr) {
        const billService = app.service('bills')
        const bills = await billService.find({ query: { rnnummer: nr } })
        if (bills.length > 0) {
          const bill = await hydrate(bills[0], billService)
          const printed = await createBill(bill)
          res.json({ result: printed })
        }
      }
    })
  /*
    .post(base+'print', async (req, res) => {
      const bill = req.body
      const result = await createBill(bill)
      res.json({ status: result })
    })
    */

  async function hydrate(bill, db) {
    delete bill.extinfo
    if (bill.fallid) {
      try {
        const fallService = app.service('fall')
        bill.fall = await fallService.get(bill.fallid)
        delete bill.fall.extinfo
      } catch (err) {
        console.log(err)
      }
    }
    if (bill.mandantid) {
      const pService = app.service('kontakt')
      bill.mandant = await pService.get(bill.mandantid)
      delete bill.mandant.extinfo
    }
    if (bill.fall) {
      if (bill.fall.patientid) {
        const pService = app.service('kontakt')
        bill.patient = await pService.get(bill.fall.patientid)
        delete bill.patient.extinfo
      }
      if (bill.fall.garantid) {
        const pService = app.service('kontakt')
        bill.garant = await pService.get(bill.fall.garantid)
        delete bill.garant.extinfo
      }
      if (bill.fall.kostentrid) {
        const pService = app.service('kontakt')
        bill.kostentraeger = await pService.get(bill.fall.kostentrid)
        delete bill.kostentraeger.extinfo
      }
    }
    return bill
  }
}
