const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const softdelete = require('../../src/hooks/softdelete');

describe('\'softdelete\' hook', () => {
  let app;
  let obj={
    id: "test",
    deleted: "0"
  }

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return obj;
      },
      async patch(id,elem,params){
        obj=Object.assign(obj,elem)
        return obj
      },
      async remove(id){
        return undefined
      }
    });

    app.service('dummy').hooks({
      before: {remove: [softdelete()]}
    });
  });

  it('runs the hook', async () => {
    const ch=app.service('dummy')
    const result = await ch.get('test');
    assert.equal(result.deleted,"0")
    const deleted= await ch.remove('test')
    assert.equal(deleted.deleted,"1")
    const check=await ch.get('test')
    assert.equal(check.deleted,"1")
  });
});
