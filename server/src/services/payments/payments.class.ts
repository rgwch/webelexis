const { Service } = require('feathers-knex');

export class Payments extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'payments'
    });
  }
};
