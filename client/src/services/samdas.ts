/**
 * This file is part of Webelexis
 * Copyright (c) 2015-2018 by G. Weirich
 */

/*
  Convert consultation entries between Elexis' Samdas-Format and HTML
 */

const parser = new DOMParser();
const serializer = new XMLSerializer();
//import * as _ from 'lodash'

/**
 * converts a substring inside a text into a span element with a given css class
 * @param text the whole text
 * @param start begin position of the markup
 * @param len  number of characters from text beggining from start to include in the markup
 * @param css  the markup (css class)
 * @returns {string} the input text with added css-class
 */
const insert = (text, start, len, css) => {
  var left = text.substr(0, start);
  var middle = text.substr(start, len);
  var right = text.substr(parseInt(start + len));
  var ret = left + '<span class="' + css + '">' + middle + '</span>' + right;
  return ret
};

/**
 * Remove all markup from a text and convert line breaks to  \n
 * @param text
 * @returns {string|XML}
 */
const cleanHTML = function (text) {
  var ret = text.replace(/<br ?\/>/g, "\n");
  return ret.replace(/<.+?>/g, "")
};


export class Samdas {
  /** extract plaintext from a Samdas document */
  static toPlaintext(samdasText) {
    if (samdasText.startsWith("<")) {
      var xml = parser.parseFromString(samdasText, "text/xml");
      var textElem = xml.getElementsByTagName("samdas:text")[0];
      if (textElem === undefined) {
        return samdasText.replace(/[\n\r][\n\r]?/g,"<br />")
      } else {
        return textElem.innerHTML
      }
    } else {
      return samdasText.replace(/[\n\r][\n\r]?/g,"<br />")
    }
  }

  /** convert a Samdas document to html */
  static toHtml(samdasText) {
    var xml = parser.parseFromString(samdasText, "text/xml");
    var textElem = xml.getElementsByTagName("text")[0];
    if (textElem === undefined) {
      return ""
    } else {
      var ret = textElem.innerHTML;
      if (ret) {
        const xrefs: Array<any> = Array.from(xml.getElementsByTagName("xref")).map(m => {
          return {
            pos: parseInt(m.getAttribute("from")),
            len: parseInt(m.getAttribute("length")),
            provider: m.getAttribute("provider"),
            xid: m.getAttribute("id"),
            type: "xref"
          }
        });

        const vrefs: Array<any> = Array.from(xml.getElementsByTagName("markup")).map(m => {
          return {
            pos: parseInt(m.getAttribute("from")),
            len: parseInt(m.getAttribute("length")),
            type: m.getAttribute("type")
          }
        });
        const refs = xrefs.concat(vrefs)
        const sorted = refs.sort(function (a, b) {
          return a.pos - b.pos
        });
        let offset = 0;

        sorted.forEach(function (elem) {
          switch (elem.type) {
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

  /** convert html text to a Samdas document */
  static toSamdas(htmlText) {
    const bootstrap = '<?xml version="1.0" encoding="UTF-8"?><samdas:EMR xmlns:samdas="http://www.elexis.ch/XSD"></samdas:EMR>';
    const xml = parser.parseFromString(bootstrap, "text/xml");
    const record = xml.createElement("record");
    let plain = "";
    let markpos = 0;
    let provider
    let docid

    const markupPattern = /<span class="(bold|italic|underline|xref)"(\s+data-[a-z]+=\".+\")*>.+?<\/span>/gm;

    const matches = htmlText.match(markupPattern);
    if (matches !== null) {
      matches.forEach(function (match) {
        let origPos = htmlText.indexOf(match, markpos);
        if (origPos > markpos) {
          plain += cleanHTML(htmlText.substring(markpos, origPos))
        }
        let destpos = plain.length;
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
          xref.setAttribute("from", destpos.toString());
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
          markup.setAttribute("from", destpos.toString());
          markup.setAttribute("length", subst.length);
          markup.setAttribute("type", types[1]);
          record.appendChild(markup)
        }

      })
    }
    plain += cleanHTML(htmlText.substr(markpos));
    var textNode = xml.createElement("text");
    textNode.appendChild(xml.createTextNode(plain));
    record.appendChild(textNode);
    var emrNode = xml.childNodes[0];
    emrNode.appendChild(record);

    return serializer.serializeToString(xml)
  }
}

