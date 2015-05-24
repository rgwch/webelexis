/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout','text!tmpl/ch-webelexis-consdetail.html', 'app/editor'], function (ko, html, ed) {


    function ConsDetailModel() {
        var self=this;
        self.contents=ko.observable()
        ed(self.contents)
        self.getText = function(){
            console.log($("#edit").trumbowyg('html'))
        }

    }

    return {
        viewModel: ConsDetailModel,
        template: html
    }
});
