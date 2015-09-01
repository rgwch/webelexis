/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

/*
 functions to convert consultation entries between Elexis' Samdas-Format and HTML
 Back in the days of Elexis 1.x, HTML 4 was new. Today, we have HTML 5 which allows for
 data-* tags. So there's no need for Samdas anymore, we can just use HTML.

 For backward-compatibility, we embed the new HTML in the old Samdas Container, so legacy Elexis won't be
 irritated.

 */

define(['underscore'], function (_) {

  var parser = new window.DOMParser();
  var serializer = new window.XMLSerializer();

  /**
   * converts a substring inside a text into a span element with a given css class
   * @param text the whole text
   * @param start begin position of the markup
   * @param len  number of characters from text beggining from start to include in the markup
   * @param css  the markup (css class)
   * @returns {string} the input text with added css-class
   */
  var insert = function (text, start, len, css) {
    var left = text.substr(0, start);
    var middle = text.substr(start, len);
    var right = text.substr(parseInt(start + len));
    var ret = left + '<span class="' + css + '">' + middle + '</span>' + right;
    return ret
  };

  /**
   * Remove all markup from a text and convert line breaks to  '\n'
   * @param text
   * @returns {string|XML}
   */
  var cleanHTML = function (text) {
    var ret = text.replace(/<br ?\/>/g, "\n");
    return ret.replace(/<.+?>/g, "")
  };

  /*
   Create HTML from Samdas-Text Element
   */
  var createHtmlFromTextElem = function (xml) {
    var textElem = xml.getElementsByTagName("text")[0];
    if (textElem === undefined) {
      return ""
    } else {
      var ret = textElem.innerHTML;
      if (ret) {
        var xrefs = _(xml.getElementsByTagName("xref")).map(function (m) {
          return {
            pos: parseInt(m.getAttribute("from")),
            len: parseInt(m.getAttribute("length")),
            provider: m.getAttribute("provider"),
            xid: m.getAttribute("id"),
            type: "xref"
          }
        });
        var refs = xrefs.concat(_(xml.getElementsByTagName("markup")).map(function (m) {
          return {
            pos: parseInt(m.getAttribute("from")),
            len: parseInt(m.getAttribute("length")),
            type: m.getAttribute("type")
          }
        }));
        var sorted = refs.sort(function (a, b) {
          return a.pos - b.pos
        });
        var offset = 0;

        _.each(sorted, function (elem) {
          switch (elem.type) {
            /* Convert markups to their html respectives */
            case "emphasized":
            case "bold":
            {
              ret = insert(ret, elem.pos + offset, elem.len, "bold");
              offset += 22 + 4;
              break;
            }
            case "italic":
            {
              ret = insert(ret, elem.pos + offset, elem.len, "italic");
              offset += 22 + 6;
              break;
            }
            case "underline":
            {
              ret = insert(ret, elem.pos + offset, elem.len, "underline");
              offset += 22 + 9;
              break;
            }
            /* convert XREF entities to data-* entities */
            case "xref":
            {
              var pos = elem.pos + offset
              var left = ret.substr(0, pos);
              var middle = ret.substr(pos, elem.len);
              var right = ret.substr(parseInt(pos + elem.len));
              var inset = '<span class="xref" data-provider="' + elem.provider + '" data-objectid="' + elem.xid + '">'
              var len = inset.length + 7
              ret = left + inset + middle + '</span>' + right;
              offset += len
            }
          }
        });
        return ret.replace(/\n/g, "<br />")
      } else {
        return textElem
      }
    }
  }

  return {

    /** extract plaintext from a Samdas document */
    plaintext: function (samdasText) {
      var xml = parser.parseFromString(samdasText, "text/xml");
      var textElem = xml.getElementsByTagName("text")[0];
      if (textElem === undefined) {
        return ""
      } else {
        return textElem.innerHTML
      }
    },

    /** convert a Samdas document to html */
    html: function (samdasText) {
      var xml = parser.parseFromString(samdasText, "text/xml");
      var htmlElem = xml.getElementByTagName("htmltext")[0];
      /*
       If the Samdas contains already a HTML Element, we just use this. Otherwise we convert the
       text-Entity inside the Samdas to HTML and return that.
       */
      if (htmlElem === undefined) {
        return createHtmlFromTextElem(xml)
      } else {
        return htmlElem
      }
    },

    /** convert html text to a Samdas document */
    samdas: function (htmlText) {
      var bootstrap = '<?xml version="1.0" encoding="UTF-8"?><samdas:EMR xmlns:samdas="http://www.elexis.ch/XSD"></samdas:EMR>';
      var xml = parser.parseFromString(bootstrap, "text/xml");
      var record = xml.createElement("record");
      var plain = "";
      var markpos = 0;
      var markupPattern = /<span class="(bold|italic|underline|xref)"(\s+data-[a-z]+=\".+\")*>.+?<\/span>/gm;

      var matches = htmlText.match(markupPattern);
      if (matches !== null) {
        _.each(matches, function (match) {
          var origPos = htmlText.indexOf(match, markpos);
          if (origPos > markpos) {
            plain += cleanHTML(htmlText.substring(markpos, origPos))
          }
          var destpos = plain.length;
          markpos = origPos + match.length;
          var checkPattern = /<span class="(.+?)">(.+?)<\/span>/;
          var types = checkPattern.exec(match);
          var subst = cleanHTML(types[2]);
          plain += subst;
          if (types[1].indexOf("xref") > -1) {
            var prov = /data-provider\s*=\s*\"([a-zA-Z0-9\/\.]+)\"/.exec(match)
            if (prov !== null) {
              provider = prov[1]
            } else {
              provider = undefined
            }
            var did = /data-objectid\s*=\s*\"([a-zA-Z0-9-_\.\/]+)\"/.exec(match)
            if (did !== null) {
              docid = did[1]
            } else {
              docid = undefined
            }
            var xref = xml.createElement("xref");
            xref.setAttribute("from", destpos);
            xref.setAttribute("length", subst.length)
            if (provider !== undefined) {
              xref.setAttribute("provider", provider)
            }
            if (docid !== undefined) {
              xref.setAttribute("id", docid);
            }

            record.appendChild(xref)
          } else {
            var markup = xml.createElement("markup");
            markup.setAttribute("from", destpos);
            markup.setAttribute("length", subst.length);
            markup.setAttribute("type", types[1]);
            record.appendChild(markup)
          }

        })
      }
      plain += cleanHTML(htmlText.substr(markpos));
      var textNode = xml.createElement("text");
      textNode.appendChild(xml.createTextNode(plain));
      var htmlNode=xml.createElement("htmltext");
      htmlNode.appendChild(htmlText)
      record.appendChild(textNode);
      record.appendChild(htmlNode);
      var emrNode = xml.childNodes[0];
      emrNode.appendChild(record);

      return serializer.serializeToString(xml)
    }
  }
});
