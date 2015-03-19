define(['app/datetools'], function (dt) {
    
    describe('datetools should', function(){
        it('should convert a Date() to a string', function(){
            assert(dt.makeCompactString(new Date()).length==8)
        })
    })
});