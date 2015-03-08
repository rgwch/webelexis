/*!
 * This file is part of Webelexis
 * originally created by Sam Carr of LShift (http://www.lshift.net/blog/2014/04/30/a-simple-knockout-page-router/)
 */

define(['knockout', 'jquery'], function (ko, $) {

    // Top-level KO ViewModel that detects URL changes and shows the relevant page.
    function Router(urlMapping, filter) {
        var self = this;
        this.urlMapping = urlMapping;

        // We swap in Page instances here to make them the current page.
        this.currentPage = ko.observable(null);

        // Listen for changes to the URL fragment (hash) triggered by links, back/forward etc.
        // and make the relevant Page instance current.
        $(window).bind("hashchange", function () {
            // Use the path between # and ? (if present).
            // Note that when URL ends with just #, some browsers return '' for location.hash, others return '#'
            // but either way substr(1) will return '' which is what we want.
            var path = location.hash.substr(1).split('?')[0];

            var pageFromFilter = filterPath(path);
            if (pageFromFilter) {
                self.currentPage(pageFromFilter);
            } else {
                self.currentPage(pageFromMapping(path));
            }
        });

        function filterPath(path) {
            return (typeof (filter) !== 'undefined') ? filter(path) : null;
        }

        function pageFromMapping(path) {
            for (var key in self.urlMapping) {
                var mapping = self.urlMapping[key];
                var matches = mapping.match.exec(path);
                if (matches) {
                    // mark the appropriate menu item as selected
                    $("#mainmenu").children(".active").removeClass("active")
                    var marker = $("#mainmenu_marker").detach()
                    $("#mainmenu").find("[href$=" + path + "]").append(marker).parent().addClass("active")
                    return new Router.Page(mapping.title, mapping.component)
                }
            }
            return new Router.Page('Nicht gefunden', 'ch-webelexis-page404');
        }

        // Manually trigger initial load of the relevant start page.
        $(window).trigger("hashchange");
    }

    // A 'page' that can be shown, encompassing the view (string identifying a template),
    // model (a KO ViewModel) and title.
    Router.Page = function (titleName, componentName) {
        this.title = ko.observable(titleName);
        /*
          this.view = ko.computed( function() {
          // If model has an error or loading property, respect it.
          if (model.error && model.error()) return 'error-template';
          if (model.loading && model.loading()) return 'loading-template';
          return view;
          */
        this.componentName = componentName;
        return componentName;
    }

    return Router;
});