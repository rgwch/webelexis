const { Service } = require('feathers-knex');

exports.Stickynotes = class Stickynotes extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'stickynotes'
    });
  }
};
