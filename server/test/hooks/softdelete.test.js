const feathers = require('@feathersjs/feathers')
const softdelete = require('../../dist/hooks/softdelete')

xdescribe("'softdelete' hook", () => {
  let app
  let obj = {
    id: 'test',
    deleted: '0',
  }

  beforeEach(() => {
    app = feathers()

    app.use('/dummy', {
      async get(id) {
        return obj
      },
      async patch(id, elem, params) {
        obj = Object.assign(obj, elem)
        return obj
      },
      async remove(id) {
        return undefined
      },
    })

    app.service('dummy').hooks({
      before: { remove: [softdelete] },
    })
  })

  it('runs the hook', async () => {
    const ch = app.service('dummy')
    const result = await ch.get('test')
    expect(result.deleted).toBe('0')
    const deleted = await ch.remove('test', { provider: 'test' })
    expect(deleted.deleted).toBe('1')
    const check = await ch.get('test')
    expect(check.deleted).toBe('1')
  })
})
