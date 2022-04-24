import { ElexisUtils } from './../../util/elexis-types';
const util = new ElexisUtils()

export class Utility {
  constructor(private options) { }
  async get(id, params) {
    switch (id) {
      case "ping": return "pong"; break;
      case "unpack": {
        return await util.unpackStringsFromString(params)
      }

      default:
        throw new Error("invalid Utility call: get " + id)
    }
  }
  async patch(id, data, params) {
    switch (id) {
      /**
       * Add a "Trace" entry to a compressed-string-field in an Extinfo block. We can't to this with the extjson concept
       * because JSON does not have a concept of ByteArray.
       */
      case "addTrace": {
        const q = params.query
        if (q && q.field && q.entry) {
          const result = util.addEntryToPackedStrings(data, q.field, q.entry)
          return result
        } else {
          throw new Error("pad parameters for addTrace " + JSON.stringify(params.query))
        }
      }
      case "setField": {
        const q = params.query
        if (q && q.field && q.entry) {
          const result = util.addEntryToExtinfo(data, q.field, q.entry)
          return result
        } else {
          throw new Error("pad parameters for setField " + JSON.stringify(params.query))
        }
      }
      default:
        throw new Error("invalid utility call: patch " + id)
    }
  }
}
