/*!
 * This file is part of Webelexis, (c) 2015 By G. Weirich
 * originally created by Sam Carr of LShift (http://www.lshift.net/blog/2014/04/30/a-simple-knockout-page-router/)
 */

define(['knockout', 'app/config', 'jquery'], function (ko, cfg, $) {

    // Top-level KO ViewModel that detects URL changes and shows the relevant page.
    function Router(filter) {
        var self = this;


        // Listen for changes to the URL fragment (hash) triggered by links, back/forward etc.
        // and make the relevant Page instance current.
        $(window).bind("hashchange", function () {
            // Use the path between # and ? (if present).
            // Note that when URL ends with just #, some browsers return '' for location.hash, others return '#'
            // but either way substr(1) will return '' which is what we want.
            var path = location.hash.substr(1).split('?')[0];
            // ask the main script, if it wants to filter the request. If so, use the page from the filter, 
            // otherweise use the urlMapping as provided in the constructor.
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

        // Select the component to display according to the path
        function pageFromMapping(path) {
                for (var i = 0; i < cfg.modules.length; i++) {
                    var mapping = cfg.modules[i];
                    if (mapping.match !== undefined) {
                        var matches = mapping.match.exec(path);
                        if (matches) {
                            if (cfg.mainMenu.indexOf(mapping)!==-1) {
                                // mark the appropriate menu item as selected, if the current module is part of the menu
                                $("#mainmenu").children(".active").removeClass("active")
                                var marker = $("#mainmenu_marker").detach()
                                var menuName=path.split('/')[0]
                                $("#mainmenu").find("[href$=" + "#" + menuName + "]").append(marker).parent().addClass("active")
                            }
                            return new Router.Page(mapping.title, mapping.component, matches.slice(1))
                        }
                    }
                }
                return new Router.Page('Nicht gefunden', 'ch-webelexis-page404');
            }
            // We swap in Page instances here to make them the current page.
        this.currentPage = ko.observable(pageFromMapping("#agenda"));

        // Manually trigger initial load of the relevant start page.
        $(window).trigger("hashchange");
    }

    /* A Page is just a KnockOut component, which makes view creation really simple. 
     * Optional parameters are parts of the path that are captured by the "match" regex of the
     * module definition in config.js. The component sees these parameters as an Array, passed as argument to
     * the constructor. */
    Router.Page = function (titleName, componentName, params) {
        this.title = ko.observable(titleName);
        this.componentName = componentName;
        this.params=params
        return componentName;
    }

    return Router;
});