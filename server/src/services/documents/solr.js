const fetch = require('node-fetch')
const _ = require('lodash')

const fields = [
  { name: "_nest_path_", type: "_nest_path_" },
  { name: "_root_", type: "string", docValues: false, indexed: true, stored: false },
  { name: "score", type: "plongs" },
  { name: "Character_Count", type: "plongs" },
  { name: "Content-Encoding", type: "text_general" },
  { name: "Content-Language", type: "text_general" },
  { name: "Content-Type", type: "text_general" },
  { name: "Creation-Date", type: "pdates" },
  { name: "Edit-Time", type: "text_general" },
  { name: "Last-Modified", type: "pdates" },
  { name: "Last-Save-Date", type: "pdates" },
  { name: "Word-Count", type: "plongs" },
  { name: "X-Parsed-By", type: "text_general" },
  { name: "_text_", type: "text_general", multiValued: true, stored: false, indexed: true },
  { name: "_version_", type: "plong", indexed: false, stored: false },
  { name: "addressee", type: "text_general", indexed: true, stored: true },
  { name: "author", type: "text_general", indexed: true, stored: true },
  { name: "category", type: "text_general", indexed: true, stored: true },
  { name: "concern", type: "text_general", multiValued: false, indexed: true, stored: true },
  { name: "contents", type: "text_general", uninvertible: false, indexed: true, multiValued: false, stored: false },
  { name: "date", type: "pdates" },
  { name: "dc_title", type: "text_general" },
  { name: "dcterms_created", type: "pdates" },
  { name: "dcterms_modified", type: "pdates" },
  { name: "deleted", type: "string", uninvertible: false, multiValued: false, indexed: true, stored: true },
  { name: "description", type: "text_general" },
  { name: "filename", type: "text_general", multiValued: false, indexed: false, stored: true },
  { name: "generator", type: "text_general", multiValued: false },
  { name: "id", type: "string", multiValued: false, required: true, stored: true, indexed: true },
  { name: "language", type: "text_general" },
  { name: "lastupdate", type: "plongs" },
  { name: "loc", type: "string", indexed: false, stored: true },
  { name: "name", type: "text_general", indexed: true, stored: true },
  { name: "subject", type: "text_general" },
  { name: "template", type: "string" },
  { name: "title", type: "text_general", indexed: true, stored: true },
  { name: "url", type: "string" }
]

const sendCommand = async (api, body) => {
  try {
    const result = await fetch(api, {
      headers: { "content-type": "application/json" }, method: "post", body: JSON.stringify(body)
    })
    if (result.status != 200) {
      console.log(result.statusText)
    }
  } catch (err) {
    console.log(err)
  }
}

const createCore = async solr => {
  const api = solr.host + "/admin/cores?action="
  try {
    let response = await fetch(`${api}STATUS&core=${solr.core}`)
    if (response.status != 200) {
      console.log(response.statusText)
    } else {
      const status = await response.json()
      if (!status.status.elexisdata.name) {
        response = await fetch(`${api}RENAME&core=gettingstarted&other=${solr.core}`)
        const result = await response.json()
        console.log(result.msg)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const checkSchema = async app => {
  const solr = app.get('solr')
  const api = solr.host + "/" + solr.core + "/schema"
  const res = await fetch(api, { method: 'get' })
  if (res.status == 200) {
    const schema = await res.json()
    for (const field of schema.schema.fields) {
      const check = fields.find(n => n.name === field.name)
      if (check) {
        if (!_.isEqual(check, field)) {
          await sendCommand(api, { "replace-field": field })
        }
      } else {
        // await sendCommand(api, { "delete-field": { name: field.name } })
      }
    }
    for (const field of fields) {
      const check = schema.schema.fields.find(n => n.name === field.name)
      if (!check) {
        await sendCommand(api, { "add-field": field })
      }
    }
    // console.log(schema)
  } else {
    if (res.status == 404) {
      console.log("schema not found")
      await createCore(solr)
      await checkSchema(app)
    } else {
      throw new Error("could not retrieve schema " + res.statusText)
    }
  }
}


module.exports = {
  checkSchema
}
