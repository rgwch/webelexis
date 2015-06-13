/**
 ** This file is part of Webelexis
 ** Copyright (c) by G. Weirich 2015
 */

define(['knockout'], function (ko) {

	return {

		// not really necessary in standard situations
		eventbusUrl: "http://localhost:2015/eventbus",
		// any page you want to be called with a click on the logo
		homepage: "http://github.com/rgwch/webelexis",
		// if false: The login field remains hidden
		showLogin: ko.observable(true),
		sessionID: "",
		user: ko.observable({
			"loggedIn": false,
			"roles": ["guest"],
			"username": "",
			"id_token": {}
		}),
		connected: ko.observable(false),
		loc: {
			ip: "0.0.0.0"
		},
		mainMenu: []
	}

});
