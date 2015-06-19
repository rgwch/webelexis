/**
 * Created by gerry on 19.06.15.
 */

define(['app/samdas'], function (smd) {
  describe('testSamdas', function () {
    it('should convert samdas to html and vice-versa', function () {
    var samdas=smd.samdas("<span>Hallo</span>");
      console.log(samdas);
      samdas.should.not.equal("Hallo")
    })
  })
});