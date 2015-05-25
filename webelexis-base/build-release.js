// build directives for r.js
({
	mainConfigFile     : 'src/main/resources/web/app/requirejs.config.js',
	optimize           : "uglify2",
	inlineText         : true,
	fileExclusionRegExp: /\.jade/,
	appDir             : "src/main/resources/web",
	dir                : "dist/web",
	keepBuildDir       : true,
	optimizeCss        : "standard",
	modules            : [{
		name: "app/main"
	}]
});
