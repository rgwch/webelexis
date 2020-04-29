const fetch = require('node-fetch')

const fields = [
  { name: "Character Count", type: "plongs" },
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
  { name: "subject", type: "string" },
  { name: "template", type: "string" },
  { name: "title", type: "text_general", indexed: true, stored: true },
  { name: "url", type: "string" }
]

const sendCommand= async (api,body)=>{
  try {
    const result = await fetch(api, {
      headers: { "content-type": "application/json" }, method: "post", body: JSON.stringify({
        "delete-field": {"name": field.name}
      })
    })
    if (result.status != 200) {
      console.log(result.statusText)
    }
  } catch (err) {
    console.log(err)
  }
}
const replaceField=async ( api, field)=>{

}
const createField= async (api, field)=>{

}

const deleteField = async (api, field) => {
    sendCommand(api)
}

const checkSchema = async app => {
  const api = app.get('solr').host + "/schema"
  const res = await fetch(api, { method: 'get' })
  if (res.status == 200) {
    schema = await res.json()
    for (const field of schema.schema.fields) {
      const check = fields.find(n => n.name === field.name)
      if (check) {

      } else {
        await sendCommand(api, {"delete-field": {name:}})
        await deleteField(api, field)
      }
    }
    for(const field of fields){
      const check=schema.schema.fields.find(n=>n.name===field.name)
      if(!check){
        await createField(api, field)
      }
    }
    console.log(schema)
  } else {
    throw new Error("could not retrieve schema " + res.statusText)
  }
}

module.exports = {
  checkSchema
}
