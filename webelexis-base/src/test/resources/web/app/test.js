define(['app/config'], function (cfg) {
    var assert = chai.assert

    describe("A test suite", function () {
            it('should fail', function () {
                assert.equal(-1, [1, 2, 3].indexOf(5))
                assert.equal(2, [1, 2, 3].indexOf(5))
            });
            //it('should fail', cfg.homepage.length == 0)
        })
        //console.log("hier " + cfg.homepage)
});