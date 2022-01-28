
const { authenticate } = require('@feathersjs/authentication').hooks;
const handleExtinfo = require('../../hooks/handle-extinfo')({ extinfo: "extinfo" })
const flatiron = require('../../hooks/flatiron')([{
  id: "fallid",
  obj: "fall",
  service: "fall"
}, {
  id: "mandantid",
  obj: "mandant",
  service: "kontakt"
}])

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [handleExtinfo, flatiron],
    update: [handleExtinfo, flatiron],
    patch: [flatiron],
    remove: []
  },

  after: {
    all: [],
    find: [handleExtinfo, flatiron],
    get: [handleExtinfo, flatiron],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
