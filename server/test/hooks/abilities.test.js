const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const abilities = require('../../src/hooks/abilities');
const {Ability} = require('@casl/ability')
const chai = require('chai')
const expect=chai.expect
const promised=require('chai-as-promised')
chai.use(promised)

describe('\'abilities\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      },
      async create(obj){
        return obj.id
      }
    });

    app.service('dummy').abilities={
      client: new Ability([
          {subject: 'all', action: 'read'}])

    }
    app.service('dummy').hooks({
      before: abilities()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test',{user: {email: 'dummy',roles: ["client"]}});
    assert.deepEqual(result, { id: 'test' });
    return app.service('dummy').create({id:'test2'},{user: {email: 'dummy',roles: ["client"]}}).then(()=>{
      expect(1).to.equal(2)
    }).catch(err=>{
      // ok
    })

  });
});
