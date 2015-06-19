// jshint -W033
define(['app/datetools'], function(dt) {

  describe('datetools should convert between Date objects and Strings', function() {
    it('should convert a Date() to a string', function() {
      dt.makeCompactFromDateObject(new Date(2015, 2, 20)).should.equal('20150320');
      var d = dt.makeDateObjectFromCompact("20150320");
      d.getFullYear().should.equal(2015);
      d.getMonth().should.equal(2);
      d.getDate().should.equal(20);
      d = dt.makeDateObjectFromLocal("20.03.2015");
      d.getFullYear().should.equal(2015);
      d.getMonth().should.equal(2);
      d.getDate().should.equal(20);
      dt.makeLocalFromDateObject(d).should.equal("20.03.2015");
      dt.makeDateRFC3339(d).should.equal("2015-03-20")

    });

    it('should convert a numer of minutes in a hh:mm String', function() {
      dt.makeTime(700).should.equal("11:40")
    });

    it('should convert hh:mm Strings in minutes', function() {
      dt.makeMinutes("11:40").should.equal(700)
    });

    it('should convert YYYYMMDD String into DD.MM.YYYY correctly', function(){
      dt.makeLocalFromCompact("20150317").should.equal("17.03.2015")
    })
  })
});
