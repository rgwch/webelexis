const { Service } = require('feathers-knex');

exports.Payments = class Payments extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'payments'
    });
  }
};
