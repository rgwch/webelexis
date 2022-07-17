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
import { logger } from '../../logger'
const mm2pt = util.mm2pt
import conf from 'config'
const billing = Object.assign({}, conf.get("billing"))
billing.creditor = Object.assign({}, billing.creditor)

function setSender(pdf, sender: string) {
  pdf.fontSize(12)
  pdf.fillColor('black')
  pdf.font('Helvetica')
  pdf.text(
    sender,
    mm2pt(20),
    mm2pt(35),
    {
      width: mm2pt(100),
      height: mm2pt(50),
      align: 'left',
    },
  )
}
export function outputInvoice(bill): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
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
              logger.error("OutputInvoice: error with mailer " + err)
              reject(err)
            })
          } else if (bill.output) {
            print(filename, billing.printer).then(fin => {
              resolve(true)

            }).catch(err => {
              logger.error("InvoiceOutput: Error with lp " + err)
              reject(err)
            })
          } else {
            resolve(true)
          }
        }
      )

      // Block Absender links oben
      let biller = bill._Mandant
      let sender = ""
      let city = ""

      // Rechnungssteller (1) Mandant aus bill, (2) Mandant aus mandators.default, (3) aus data.creditor (=billing.creditor)
      if (biller) {
        setSender(pdf, biller.anschrift.replace(/\r\n/g, "\n").replace(/\n\n+/g, "\n"))
        sender = `${biller.bezeichnung2} ${biller.bezeichnung1}, ${biller.strasse}, ${biller.plz} ${biller.ort}`
        city = biller.ort
      } else {
        const mandators = conf.get("mandators")
        if (mandators?.default) {
          const abs = mandators.default
          setSender(pdf, `${abs.name}\n${abs.subtitle}\n${abs.street}\n${abs.place}\n\nTel: ${abs.phone}\nMail: ${abs.email}`)
          sender = `${abs.name}, ${abs.street}, ${abs.place}`
          city = abs.place
        } else {
          const abs = data.creditor
          setSender(pdf, `${abs.name.replace(/\|/g, "\n")}\n${abs.address.replace(/\|/g, "\n")}\n${abs.zip} ${abs.city}`)
          sender = `${abs.name}, ${abs.address}, ${abs.zip} ${abs.city}`
          city = abs.city
        }
      }
      // Ort und Datum
      const date = new Date()
      pdf.fontSize(11)
      pdf.font('Helvetica')
      pdf.text(
        `${city}, ${date.getDate()}.${(date.getMonth() + 1)}.${date.getFullYear()}`,
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
      const addr = bill._Fall._Garant || bill._Fall._Patient
      pdf.text(
        addr.anschrift,
        mm2pt(130),
        mm2pt(60),
        {
          width: mm2pt(70),
          height: mm2pt(50),
          align: 'left',
        },
      )

      // Rechnungsdetails
      pdf.rect(mm2pt(20), mm2pt(112.5), mm2pt(85), mm2pt(20))
        .lineWidth(1)
        .fillOpacity(0.5)
        .fillAndStroke("gray", "#555")

      let heading;
      let invoiceText
      switch (parseInt(bill.rnstatus)) {
        case 4:
        case 5:
          heading = billing[bill._Fall?.gesetz]?.invoiceHeading || billing.invoiceHeading;
          invoiceText = billing[bill._Fall?.gesetz]?.invoiceText || billing.invoiceText
          break;
        case 6:
        case 7:
          heading = billing[bill._Fall?.gesetz]?.reminder1Heading || billing.reminder1Heading;
          invoiceText = billing[bill._Fall?.gesetz]?.reminder1Text || billing.reminder1Text;
          break;
        case 8:
        case 9:
          heading = billing[bill._Fall?.gesetz]?.reminder2Heading || billing.reminder2Heading;
          invoiceText = billing[bill._Fall?.gesetz]?.reminder2Text || billing.reminder2Text;
          break;
        default:
          heading = billing[bill._Fall?.gesetz]?.reminder3Heading || billing.reminder3Heading
          invoiceText = billing[bill._Fall?.gesetz]?.reminder3Text || billing.reminder3Text;
      }

      const patient = bill._Fall._Patient

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
      pdf.text(`${patient.bezeichnung2} ${patient.bezeichnung1}, ${DateTime.fromISO(patient.geburtsdatum).toFormat(billing.datetime)}\n`
        + `Rechnungsdatum:   ${DateTime.fromISO(bill.rndatum).toFormat(billing.datetime)}\nLeistungen von: ${DateTime.fromISO(bill.rndatumvon).toFormat(billing.datetime)}\n`
        + `Leistungen bis: ${DateTime.fromISO(bill.rndatumbis).toFormat(billing.datetime)}`,
        mm2pt(22), mm2pt(115), {
        width: mm2pt(120),
        align: "left"
      })

      // Freitext
      pdf.fontSize(12)
      pdf.font("Times-Roman")
      pdf.text(invoiceText, mm2pt(20), mm2pt(140), {
        width: mm2pt(180),
        align: "left"
      })


      pdf.addQRBill()
      pdf.end()
    } catch (error) {
      logger.error(error)
      reject(error)
    }
  })
}
export function paymentSlip(bill) {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new qrbill.PDF(
        createData(bill),
        path.join(billing.output || '.', bill.rnnummer + '.pdf'),
        () => {
          logger.debug('ok')
          resolve(true)
        },
      )
    } catch (err) {
      logger.error(err)
      reject(err)
    }
  })
}

function createData(bill) {
  // const patient = bill._Fall._Patient
  const garant = bill._Fall._Garant || bill._Fall._Patient
  let creditor = billing.creditor
  if (bill._Mandant) {
    creditor = {
      name: bill._Mandant.bezeichnung2 + " " + bill._Mandant.bezeichnung1,
      address: bill._Mandant.strasse,
      zip: parseInt(bill._Mandant.plz),
      city: bill._Mandant.ort,
      country: "CH",
      account: bill._Mandant.extjson["ch.elexis.ungrad/rbills/iban"]
    }
  }
  const data = {
    currency: 'CHF' as Currency,
    amount: amount(bill.betrag),
    reference: reference(bill),
    creditor,
    debtor: {
      name: garant.bezeichnung2 + ' ' + garant.bezeichnung1,
      address: garant.strasse,
      zip: parseInt(garant.plz),
      city: garant.ort,
      country: 'CH',
    },
  }
  return data
}
function amount(asstring) {
  const ret = parseInt(asstring)
  return ret / 100.0
}

/**
 *
 * @param bill create a reference line
 * @returns
 */
function reference(bill): string {
  let refline = "";
  const pnr = bill._Fall._Patient.patientnr
  const rnnr = bill.rnnummer
  if (bill._Mandant.extjson.TarmedESRParticipantNumber) {
    const esr = bill._Mandant.extjson.TarmedESRIdentity || ""
    const space = 26 - esr.length - 12
    refline = esr.padEnd(space, "0") + pnr.padStart(6, "0") + rnnr.padStart(6, "0")
  } else {
    const prefix = new Date().toISOString().substring(0, 10).replace(/\-/g, '')
    refline = (prefix + '0000' + pnr.padStart(5, '0') + rnnr.padStart(5, '0')).padEnd(26, '0')
  }
  return luhn(refline)
}

/**
 * Append a Modulo-10 (Luhn) Checksum to a line of numbers
 * @param num a string consisting of numbers
 * @returns the same string with added checksum
 */
function luhn(num: string): string {
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
