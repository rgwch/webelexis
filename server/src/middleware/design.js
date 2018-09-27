module.exports = function (options = {}) {
  return function design(req, res, next) {
    console.log('design middleware is running');
    next();
  };
};
