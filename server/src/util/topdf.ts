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

export default {
  merge: merge,
  toPDF: merge
}
