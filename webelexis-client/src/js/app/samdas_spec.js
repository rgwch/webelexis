define(function (require) {


  describe('testSamdas', function () {
    var smd = require('samdas');
    it('should convert samdas to html and vice-versa', function () {
    var samdas=smd.samdas("<span>Hallo</span>");
      samdas.should.not.equal("Hallo")
    })
  })

});