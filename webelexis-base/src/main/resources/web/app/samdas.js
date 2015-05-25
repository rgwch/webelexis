/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

/*
 functions to convert consultation entries between Elexis' Samdas-Format and HTML
 */

define(['underscore'], function (_) {

	var parser = new window.DOMParser()

	var insert = function (text, start, len, css) {
		var left = text.substr(0, start)
		var middle = text.substr(start, len)
		var right = text.substr(parseInt(start + len))
		var ret = left + '<span class="' + css + '">' + middle + '</span>' + right
		return ret
	}
	return {
		plaintext: function (samdasText) {
			var xml = parser.parseFromString(samdasText, "text/xml")
			var textElem = xml.getElementsByTagName("text")[0]
			if (textElem === undefined) {
				return ""
			} else {
				return textElem.innerHTML
			}
		},

		html: function (samdasText) {
			var xml = parser.parseFromString(samdasText, "text/xml")
			var textElem = xml.getElementsByTagName("text")[0]
			if (textElem === undefined) {
				return ""
			} else {
				var ret = textElem.innerHTML
				if (ret) {
					var xrefs = _(xml.getElementsByTagName("xref")).map(function (m) {
						return {
							pos     : parseInt(m.getAttribute("from")),
							len     : parseInt(m.getAttribute("length")),
							provider: m.getAttribute("provider"),
							xid     : m.getAttribute("id"),
							type    : "xref"
						}
					})
					var refs = xrefs.concat(_(xml.getElementsByTagName("markup")).map(function (m) {
						return {
							pos : parseInt(m.getAttribute("from")),
							len : parseInt(m.getAttribute("length")),
							type: m.getAttribute("type")
						}
					}))
					var sorted = refs.sort(function (a, b) {
						return a.pos - b.pos
					})
					var offset = 0

					_.each(sorted, function (elem) {
						switch (elem.type) {
							case "emphasized":
							case "bold":
							{
								ret = insert(ret, elem.pos + offset, elem.len, "bold")
								offset += 22 + 4
								break;
							}
							case "italic":
							{
								ret = insert(ret, elem.pos + offset, elem.len, "italic")
								offset += 22 + 6
								break;
							}
							case "underlined":
							{
								ret = insert(ret, elem.pos + offset, elem.len, "underline")
								offset += 22 + 9
								break;
							}
							case "xref":
							{
								ret = insert(ret, elem.pos + offset, elem.len, "xref")
								offset += 22 + 4
							}
						}
					})
					return ret.replace(/\n/g, "<br />")
				} else {
					return textElem
				}

			}
		}
	}
})
