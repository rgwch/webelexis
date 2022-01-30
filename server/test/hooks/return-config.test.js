/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const feathers = require('@feathersjs/feathers')
const returnConfig = require('../../dist/hooks/return-config')

xdescribe("'return-config' hook", () => {
  let app

  beforeEach(() => {
    app = feathers()

    app.use('/dummy', {
      async get(id) {
        return { param: id, wert: 'something' }
      },
    })

    app.service('dummy').hooks({
      after: returnConfig(),
    })
  })

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test')

    expect(result), toBe('something')
  })
})
