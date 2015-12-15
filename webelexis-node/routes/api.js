/**
 * Created by gerry on 15.12.15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({'version':'1.0.0','copyright':'(c) 2015 by G. Weirich'});
});

module.exports = router;
