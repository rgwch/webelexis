define(['components/menubar/ch-webelexis-menubar', 'app/eb', 'app/config'], function (menu, bus, cfg) {

    describe('webelexis main menu bar and login field', function () {

        var mb = null

        beforeEach(function () {
                cfg.modules.forEach(function (item) {
                    cfg.mainMenu.push(item)
                })
                mb = new menu.viewModel({
                    menu: 'mainMenu'
                })
            })
            /*    
        sinon.stub(bus, "send", function(msg, params, callback) {
            if (msg === 'ch.webelexis.auth.login') {
                callback({"status": "ok", "sessionID": "1234"})
            }
        })
 */
        it('should show login/logout status correctly', function () {
            cfg.showLogin(false)
            mb.showLogin().should.be.false
            mb.showLogout().should.be.false
            cfg.showLogin(true)
            mb.showLogin().should.be.true
            mb.showLogout().should.be.false
            cfg.user({
                "loggedIn": true,
                "roles": ["user"]
            })
            mb.showLogin().should.be.false
            mb.showLogout().should.be.true
        })

    })


})