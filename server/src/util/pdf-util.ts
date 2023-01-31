import puppeteer, { PaperFormat } from 'puppeteer';

export const createPDF = async (html: string, outputPath: string, format: PaperFormat) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  await page.pdf({ format, displayHeaderFooter: false, path: outputPath })
}


function merge(template, doc) {
  const fieldmatcher = /\[\w+\.\w+\]/ig

  const compiled = template.replace(fieldmatcher, function (field) {
    const stripped = field.substring(1, field.length - 1)
    const [element, attribute] = stripped.split(".")
    let replacement
    switch (element) {
      case "addressee": replacement = doc.addressee[attribute]; break;
      case "patient":
      case "concern": replacement = doc.concern[attribute]; break
      default: replacement = field
    }
    if (replacement) {
      return replacement
    } else {
      return field
    }
  })

  return compiled
}

