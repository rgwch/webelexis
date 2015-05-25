// build directives for r.js
({
	mainConfigFile     : 'src/main/resources/web/app/requirejs.config.js',
	optimize           : "none",
	inlineText         : false,
	fileExclusionRegExp: /\.jade/,
	appDir             : "src/main/resources/web",
	dir                : "dist/web",
	keepBuildDir       : true,
	modules            : [{
		name: "app/main"
	}]
});
