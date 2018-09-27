const design = require('./design');
module.exports = function (app) {
  app.use('/home/design', design());
};
