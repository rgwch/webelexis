const { Service } = require('feathers-knex');

exports.Stickynotes = class Stickynotes extends Service {
  constructor(options) {
    options.name='stickynotes'
    super(options);
  }
};
