const { Service } = require('feathers-knex');

exports.Bills = class Bills extends Service {
  constructor(options) {
    options.name='rechnungen'
    super(options);
  }
};
