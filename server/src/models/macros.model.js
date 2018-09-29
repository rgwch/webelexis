const NeDB = require('nedb');
const path = require('path');

module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'macros.db'),
    autoload: true
  });
  Model.ensureIndex({ fieldName: "name", unique: true }, function (err) {
    if (err) {
      throw (err)
    }
  })

  return Model;
};
