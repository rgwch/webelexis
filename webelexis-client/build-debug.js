/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

// build directives for r.js
({
	mainConfigFile     : 'assets/app/requirejs.config.js',
	optimize           : "none",
	inlineText         : false,
	fileExclusionRegExp: /\.jade/,
	appDir             : "assets",
	dir                : "dist",
	keepBuildDir       : true,
	modules            : [{
		name: "app/main"
	}]
});
