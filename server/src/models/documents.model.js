const NeDB = require('nedb');
const path = require('path');
const logger = require('../logger')

module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'documents.db'),
    autoload: true
  });

  return Model;
};
