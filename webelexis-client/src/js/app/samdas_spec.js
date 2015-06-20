define(function (require) {


  describe.skip('testSamdas', function () {
    var smd = require('samdas');
    it('should convert samdas to html and vice-versa', function () {
    var samdas=smd.samdas("<span>Hallo</span>");
      console.log(samdas);
      samdas.should.not.equal("Hallo")
    })
  })

});