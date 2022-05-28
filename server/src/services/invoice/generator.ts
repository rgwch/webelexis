/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import qrbill from 'swissqrbill'
const util = qrbill.utils // require('swissqrbill/utils')
import path from 'path'
import { Currency } from 'swissqrbill/lib/node/esm/shared/types'
import { print } from 'unix-print'
import { DateTime } from 'luxon'
import { Mailer } from '../../util/mailer'
const mm2pt = util.mm2pt
import conf from 'config'
const billing=conf.get("billing")

export function outputInvoice(bill):Promise<boolean> {
  return new Promise((resolve, reject) => {
    const data = createData(bill)
    const filename = path.join(billing.output || '.', bill.rnnummer + '.pdf')
    const pdf = new qrbill.PDF(
      data, filename,
      {
        autoGenerate: false,
        size: 'A4',
      }, () => {
        if (bill.toMail) {
          const smtp = conf.get("smtp")
          const mailer = new Mailer(smtp, "praxis@weirich.ch")
          mailer.send(bill.toMail, "Ihre Arztrechnung", "Im Anhang Ihre Arztrechnung", { filename: "Rechnung.pdf", path: filename }).then(result => {
            resolve(true)
          }).catch(err => {
            console.log("error with mailer " + err)
            reject(err)
          })
        } else if (bill.output) {
          print(filename, billing.printer).then(fin => {
            resolve(true)

          }).catch(err => {
            console.log("Error with lp " + err)
            reject(err)
          })
        } else {
          resolve(true)
        }
      }
    )

    // Block Absender links oben
    pdf.fontSize(12)
    pdf.fillColor('black')
    pdf.font('Helvetica')
    let sender = ""
    const mandators=conf.get("mandators")
    if (mandators?.default) {
      const abs = mandators.default
      pdf.text(
        `${abs.name}\n${abs.subtitle}\n${abs.street}\n${abs.place}\n\nTel: ${abs.phone}\nMail: ${abs.email}`,
        mm2pt(20),
        mm2pt(35),
        {
          width: mm2pt(100),
          height: mm2pt(50),
          align: 'left',
        },
      )
      sender = `${abs.name}, ${abs.street}, ${abs.place}`
    } else {
      const abs = data.creditor
      pdf.text(
        `${abs.name.replace(/\|/g, "\n")}\n${abs.address.replace(/\|/g, "\n")}\n${abs.zip} ${abs.city}`,
        mm2pt(20),
        mm2pt(35),
        {
          width: mm2pt(100),
          height: mm2pt(50),
          align: 'left',
        },
      )
      sender = `${abs.name}, ${abs.address}, ${abs.zip} ${abs.city}`
    }
    // Ort und Datum
    const date = new Date()
    const c = data.creditor
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

    // Adressat und Absenderzeile
    pdf.fontSize(8)
    pdf.text(sender, mm2pt(130), mm2pt(52))
    pdf.fontSize(12)
    pdf.font('Helvetica')
    const d = data.debtor
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

    // Rechnungsdetails
    pdf.rect(mm2pt(20), mm2pt(112.5), mm2pt(75), mm2pt(16))
      .lineWidth(1)
      .fillOpacity(0.5)
      .fillAndStroke("gray", "#555")

    let heading;
    let invoiceText
    switch (parseInt(bill.rnstatus)) {
      case 4:
      case 5:
        heading = billing.invoiceHeading;
        invoiceText = billing.invoiceText
        break;
      case 6:
      case 7:
        heading = billing.reminder1Heading;
        invoiceText = billing.reminder1Text;
        break;
      case 8:
      case 9:
        heading = billing.reminder2Heading;
        invoiceText = billing.reminder2Text;
        break;
      default:
        heading = billing.reminder3Heading
        invoiceText = billing.reminder3Text;
    }

    pdf.fontSize(14)
      .font('Helvetica-Bold')
      .fillColor("black")
      .opacity(1)
      .text(`${heading} ${bill.rnnummer}`, mm2pt(20), mm2pt(100), {
        width: mm2pt(170),
        align: 'left',
      })

    pdf.fontSize(11)
    pdf.font("Courier")
    pdf.text(`Rechnungsdatum:   ${DateTime.fromISO(bill.rndatum).toFormat(billing.datetime)}\nBehandlungen von: ${DateTime.fromISO(bill.rndatumvon).toFormat(billing.datetime)}\n`
      + `Behandlungen bis: ${DateTime.fromISO(bill.rndatumbis).toFormat(billing.datetime)}`,
      mm2pt(22), mm2pt(115), {
      width: mm2pt(120),
      align: "left"
    })

    // Freitext
    pdf.fontSize(12)
    pdf.font("Times-Roman")
    pdf.text(invoiceText, mm2pt(20), mm2pt(135), {
      width: mm2pt(180),
      align: "left"
    })


    pdf.addQRBill()
    pdf.end()
  })
}
export function paymentSlip(bill) {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new qrbill.PDF(
        createData(bill),
        path.join(billing.output || '.', bill.rnnummer + '.pdf'),
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
  const patient = bill._Fall._Patient
  const data = {
    currency: 'CHF' as Currency,
    amount: amount(bill.betrag),
    reference: reference(bill),
    creditor: billing.creditor,
    debtor: {
      name: patient.bezeichnung2 + ' ' + patient.bezeichnung1,
      address: patient.strasse,
      zip: parseInt(patient.plz),
      city: patient.ort,
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
  const pnr = bill._Fall._Patient.patientnr
  const rnnr = bill.rnnummer
  const prefix = new Date().toISOString().substring(0, 10).replace(/\-/g, '')
  const refline = (prefix + '0000' + pnr.padStart(5, '0') + rnnr.padStart(5, '0')).padEnd(26, '0')
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
