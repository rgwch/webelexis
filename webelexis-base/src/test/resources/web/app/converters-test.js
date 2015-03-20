define(['app/datetools'], function (dt) {
    
    describe('datetools should convert between Date objects and Strings', function(){
        it('should convert a Date() to a string', function(){
            dt.makeCompactString(new Date(2015,2,20)).should.equal('20150320')
            var d=dt.makeDate("20150320")
            d.getFullYear().should.equal(2015)
            d.getMonth().should.equal(2)
            d.getDate().should.equal(20)
            d=dt.makeDateFromlocal("20.03.2015")
            d.getFullYear().should.equal(2015)
            d.getMonth().should.equal(2)
            d.getDate().should.equal(20)
            dt.makeDateString(d).should.equal("20.03.2015")
            dt.makeDateRFC3339(d).should.equal("2015-03-20")
            dt.makeTime(700).should.equal("11:40")
            
        })
    })
});































