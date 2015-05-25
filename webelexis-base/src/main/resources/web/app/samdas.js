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

	var cleanHTML = function (text) {
		var ret = text.replace(/<br ?\/>/g, "\n");
		return ret.replace(/<.+?>/g, "")
	}
	return {
		/* extract plaintext from a Samdas document */
		plaintext: function (samdasText) {
			var xml = parser.parseFromString(samdasText, "text/xml")
			var textElem = xml.getElementsByTagName("text")[0]
			if (textElem === undefined) {
				return ""
			} else {
				return textElem.innerHTML
			}
		},

		/* convert a Samdas document to html */
		html  : function (samdasText) {
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
		},
		/* convert html text to a Samdas document */
		samdas: function (htmlText) {
			var bootstrap = '<?xml version="1.0" encoding="UTF-8"?><samdas:EMR xmlns:samdas="http://www.elexis.ch/XSD"></samdas:EMR>'
			var xml = parser.parseFromString(bootstrap, "text/xml")
			var record = xml.createElement("record")
			var plain = ""
			var markpos = 0
			var markupPattern = /<span class="(bold|italic|underlined|xref)">.+?<\/span>/gm

			var matches = htmlText.match(markupPattern)
			if (matches !== null) {
				_.each(matches, function (match) {
					console.log(match)
					var origPos = htmlText.indexOf(match, markpos)
					if (origPos > markpos) {
						plain += cleanHTML(htmlText.substring(markpos, origPos))
					}
					var destpos = plain.length
					markpos = origPos + match.length;
					var checkPattern = /<span class="(.+?)">(.+?)<\/span>/
					var types = checkPattern.exec(match)
					var subst = cleanHTML(types[2])
					plain += subst
					if (types[1] === "xref") {
						var xref = xml.createElement("xref")
						xref.setAttribute("from", destpos)
						xref.setAttribute("length", subst.length)
						xref.setAttribute("provider", "ch.elexis.text.DocXRef")  // todo
						xref.setAttribute("id", "0")
						record.appendChild(xref)
					} else {
						var markup = xml.createElement("markup")
						markup.setAttribute("from", destpos)
						markup.setAttribute("length", subst.length)
						markup.setAttribute("type", types[1])
						record.appendChild(markup)
					}

				})
			}
			plain += cleanHTML(htmlText.substr(markpos))
			var textNode = xml.createElement("text")
			textNode.appendChild(xml.createTextNode(plain))
			record.appendChild(textNode)
			var emrNode = xml.childNodes[0]
			emrNode.appendChild(record)
		}
	}
})
