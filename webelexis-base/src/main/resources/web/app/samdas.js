/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

define({

	plaintext: function (samdasText) {
		var parser = new window.DOMParser()
		var xml = parser.parseFromString(samdasText, "text/xml")
		var textElem = xml.getElementsByTagName("text")[0]
		if (textElem === undefined) {
			return ""
		} else {
			return textElem.innerHTML
		}
	},
	html     : function (samdasText) {
		var parser = new window.DOMParser()
		var xml = parser.parseFromString(samdasText, "text/xml")
		var textElem = xml.getElementsByTagName("text")[0]
		if (textElem === undefined) {
			return ""
		} else {
			if (textElem.innerHTML) {
				return textElem.innerHTML.replace(/\n/g, "<br>")
			} else {
				return textElem
			}
		}

	}

})
