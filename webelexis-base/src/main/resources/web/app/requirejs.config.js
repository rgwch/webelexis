/*!
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */
var require = {
	baseUrl: ".",
	paths  : {
		"bootstrap"        : "lib/bootstrap.min",
		"jquery"           : "lib/jquery.min",
		"jquery-ui"        : "lib/jquery-ui",
		"validate"         : "lib/jquery.validate.min",
		"knockout"         : "lib/knockout",
		"sockjs"           : "lib/sockjs.min",
		"text"             : "lib/text",
		"vertxbus"         : "lib/vertxbus",
		"knockout-jqueryui": "lib/knockout-jqueryui",
		"cookie"           : "lib/js.cookie-1.5.0.min",
		"bus"              : "app/eb",
		"spark"            : "https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min",
		"underscore"       : "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
		"flot"             : "https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.min",
		"flot-time"        : "https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.time.min",
		"cke"			   : "https://cdnjs.cloudflare.com/ajax/libs/ckeditor/4.4.5/ckeditor",
		"smooth"           : "lib/curvedLines",
		"app"              : "app",
		"tmpl"             : "tmpl"
	},
	shim   : {
		"bootstrap": {
			deps: ["jquery"]
		},
		"knockout" : {
			deps: ["jquery"]
		},
		"validate" : {
			deps: ["jquery"]
		},
		"flot-time": {
			deps: ["flot"]
		},
		"smooth"   : {
			deps: ["flot"]
		},
		"cke"      : {
			deps: ["jquery"]
		}
	}
};
