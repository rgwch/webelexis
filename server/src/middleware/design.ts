export default function (options = {}) {
  return function design(req, res, next) {
    console.log('design middleware is running');
    res.json({status: "designd"})
    // next();
  };
};
