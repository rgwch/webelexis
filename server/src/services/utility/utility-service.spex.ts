import app from '../../test/app'
import utility from './utility-service'
app.configure(utility)

import fs from 'fs'
import { ElexisUtils } from '../../util/elexis-types'
const util = new ElexisUtils()

describe('Utility', () => {
  let service

  beforeAll(() => {
    service = app.service('utility')

  })
  
  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  xit("extends a packed string field", async () => {
    const zipped = fs.readFileSync("./test/test4.bin")
    const rezipped = await service.patch("addTrace", zipped, { field: "Statusänderung", entry: "__Modified__" });
    const unpacked = util.getExtInfo(rezipped)
    const expanded = await service.get("unpack", unpacked["Statusänderung"])
    expect(expanded).toContain("__Modified__")
  })

})
