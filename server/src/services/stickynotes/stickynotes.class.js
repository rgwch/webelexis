const { Service } = require('feathers-knex');

exports.Stickynotes = class Stickynotes extends Service {
  constructor(options) {
    options.name='ch_elexis_stickynotes'
    super(options);
  }
};
