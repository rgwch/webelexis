var require = {
		baseURL: ".",
		paths: {
			"bootstrap":	"../lib/bootstrap",
			"datepicker":	"../lib/datepicker",
			"datepicker.de":"../lib/datepicker.de",
			"jquery":		"../lib/jquery",
			"knockout":		"../lib/knockout",
			"sockjs":		"../lib/sockjs",
			"vertxbus":		"../lib/vertxbus",
		},
	
		shim: {
			"bootstrap":	{ deps: ["jquery"]},
			"datepicker":	{ deps: ["jquery", "bootstrap"]},
			"datepicker.de":{ deps: ["jquery", "bootstrap", "datepicker"]}
		}
}