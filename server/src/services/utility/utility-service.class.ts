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
      case "addTrace": {
        const result = util.addEntryToPackedStrings(data, params.field, params.entry)
        return result;
      }
      default:
        throw new Error("invalid utility call: patch " + id)
    }
  }
}
