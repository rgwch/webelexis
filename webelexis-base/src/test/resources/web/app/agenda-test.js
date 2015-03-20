define(['components/agenda/ch-webelexis-agenda', 'app/eb'], function(agenda, bus) {

    describe('check some methods af the agenda ViewModel', function() {
        var ag = null;
        sinon.stub(bus,"send",function(){})
        
        beforeEach(function() {
            ag = new agenda.viewModel()
        })
        it('should start with zero appointments', function() {
            ag.appointments.length.should.equal(0)
        })
        it("should be set on today's date", function() {
            var dat = ag.readDate()
            var now = new Date()
            dat.getFullYear().should.equal(now.getFullYear())
            dat.getMonth().should.equal(now.getMonth())
            dat.getDate().should.equal(now.getDate())
        })
        it('should set a new date correctly', function() {
            var once = new Date(2012, 1, 12)
            ag.writeDate(once)
            var then = ag.readDate()
            then.getFullYear().should.equal(2012)
            then.getMonth().should.equal(1)
            then.getDate().should.equal(12)
        })
        it('should add a new appointment', function() {
            var app = new ag.Appointment(['20150319', 575, 30, 'doc', 'besetzt', '123456790asdfgg'])
            ag.appointments.push(app)
            ag.appointments().length.should.equal(1)
            var a2 = ag.appointments()[0]
            a2.date.getFullYear().should.equal(2015)
            a2.begin.should.equal("09:35")
            a2.end.should.equal("10:05")
            a2.time.should.equal("09:35-10:05")
            a2.displayClass().should.equal('occupied')
        })
        it('should go to yesterday and tomorrow',function(){
            ag.writeDate(new Date(2013,4,12))
            ag.tomorrow()
        })

    })
})







