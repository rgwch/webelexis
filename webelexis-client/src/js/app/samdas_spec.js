define(function (require) {
  var smd = require('samdas');


  describe('testSamdas', function () {
    it('should convert samdas to html and vice-versa', function () {
      var dummy_entry = 'lorem ipsum <span class="bold">dolor</span> sit<br />' +
        'nunc <span class="italic">durandum</span> altra.<br />' +
        '<span class="underline">Et sic</span> dicit<span class="xref" data-provider="ch.elexis.text.DocXref" data-objectid="Zc03564ba8adb883503189">Donat</span>' +
        '<br />Ferentes.'
      var samdas_string = smd.samdas(dummy_entry);
      var back_convert = smd.html(samdas_string)
      console.log(samdas_string)
      console.log(back_convert)
      samdas_string.should.equal(back_convert)

    })
  })

});