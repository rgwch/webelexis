import { PDF } from 'swissqrbill/pdf'
import { mm2pt } from 'swissqrbill/utils'
import cfg from './config.js'
import path from 'path'

export function createBill(bill) {
  return new Promise((resolve, reject) => {
    const data = createData(bill)
    const pdf = new PDF(
      data,
      path.join(cfg.billing.output || '.', bill.rnnummer + '.pdf'),
      {
        autoGenerate: false,
        size: 'A4',
      },()=>resolve(true)
    )
    pdf.fontSize(12)
    pdf.fillColor('black')
    pdf.font('Helvetica')
    const c = data.creditor
    pdf.text(
      `${c.name}\n${c.address}\n${c.zip} ${c.city}`,
      mm2pt(20),
      mm2pt(35),
      {
        width: mm2pt(100),
        height: mm2pt(50),
        align: 'left',
      },
    )
    const date = new Date()

    pdf.fontSize(11)
    pdf.font('Helvetica')
    pdf.text(
      `${c.city}, ${date.getDate()}.${(date.getMonth() + 1)}.${date.getFullYear()}`,
        mm2pt(20),
        mm2pt(35),
      {
        width: mm2pt(170),
        align: 'right',
      },
    )
    pdf.fontSize(12)
    pdf.font('Helvetica')
    const d=data.debtor
    pdf.text(
      `${d.name}\n${d.address}\n${d.zip} ${d.city}`,
      mm2pt(130),
      mm2pt(60),
      {
        width: mm2pt(70),
        height: mm2pt(50),
        align: 'left',
      },
    )
    pdf.fontSize(14)
    pdf.font('Helvetica-Bold')
    pdf.text('Rechnung Nr. '+bill.rnnummer, mm2pt(20), mm2pt(100), {
      width: mm2pt(170),
      align: 'left',
    })

    
    pdf.addQRBill()
    pdf.end()
  })
}
export function paymentSlip(bill) {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new PDF(
        createData(bill),
        path.join(cfg.billing.output || '.', bill.rnnummer + '.pdf'),
        () => {
          console.log('ok')
          resolve(true)
        },
      )
    } catch (err) {
      reject(err)
    }
  })
}

function createData(bill) {
  const data = {
    currency: 'CHF',
    amount: amount(bill.betrag),
    reference: reference(bill),
    creditor: cfg.creditor,
    debtor: {
      name: bill.patient.bezeichnung1 + ' ' + bill.patient.bezeichnung2,
      address: bill.patient.strasse,
      zip: bill.patient.plz,
      city: bill.patient.ort,
      country: 'CH',
    },
  }
  return data
}
function amount(asstring) {
  const ret = parseInt(asstring)
  return ret / 100.0
}

function reference(bill) {
  const pnr = bill.patient.patientnr
  const rnnr = bill.rnnummer
  const prefix = new Date().toISOString().substring(0, 10).replace(/\-/g, '')
  const refline = (prefix + '0000' + pnr.padStart(5,'0)') + rnnr.padStart(5,'0')).padEnd(26, '0')
  return luhn(refline)
}

function luhn(num) {
  let row = 0
  let nr = num.replace(/[^0-9]/g, '')
  for (let i = 0; i < nr.length; i++) {
    let col = parseInt(nr.substring(i, i + 1))
    row = checksum[row][col]
  }
  return num + checksum[row][10].toString()
}
/** Array für den modulo-10-Prüfsummencode */
const checksum = [
  [0, 9, 4, 6, 8, 2, 7, 1, 3, 5, 0],
  [9, 4, 6, 8, 2, 7, 1, 3, 5, 0, 9],
  [4, 6, 8, 2, 7, 1, 3, 5, 0, 9, 8],
  [6, 8, 2, 7, 1, 3, 5, 0, 9, 4, 7],
  [8, 2, 7, 1, 3, 5, 0, 9, 4, 6, 6],
  [2, 7, 1, 3, 5, 0, 9, 4, 6, 8, 5],
  [7, 1, 3, 5, 0, 9, 4, 6, 8, 2, 4],
  [1, 3, 5, 0, 9, 4, 6, 8, 2, 7, 3],
  [3, 5, 0, 9, 4, 6, 8, 2, 7, 1, 2],
  [5, 0, 9, 4, 6, 8, 2, 7, 1, 3, 1],
]
