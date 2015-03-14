define(['sammy', 'jquery', 'knockout', 'bootstrap', 'jqueryui'], function (Sammy, $, ko) {
    ko.components.register('agenda', {
        require: '../components/agenda/ch-webelexis-agenda'
    })
    ko.components.register('other', {
        require: '../components/login/ch-webelexis-login'
    })

    function ViewModel() {
        self = this
        self.currentView = ko.observable()
        self.views = ko.observableArray(['agenda', 'other'])
    }

    var vm = new ViewModel();
    ko.applyBindings(vm)

    Sammy(function () {
        this.get('#:view', function () {
            vm.currentView(this.params.view)
        })
    }).run('#agenda')
})