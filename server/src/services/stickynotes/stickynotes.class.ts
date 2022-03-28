const { Service } = require('feathers-knex');

export class Stickynotes extends Service {
  constructor(options) {
    options.name='ch_elexis_stickynotes'
    super(options);
  }
};
