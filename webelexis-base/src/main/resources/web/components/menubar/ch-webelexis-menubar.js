define(['app/config','knockout','text!ch-webelexis-menubar.html', 'domReady!'],function(cfg,ko,html){
    function MenubarModel(params){
        var self=this
        self.menuItems=ko.observableArray(cfg[params.menu])
        //console.log(self.menu()[0].baseUrl+","+self.menu()[0].title)
        //self.menuItems=ko.observableArray([{baseUrl: '#agenda', title: 'Agenda'},{baseUrl: 'haha', title: 'HiHi'}])
    }
    return{
        viewModel: MenubarModel,
        template: html
    }
})