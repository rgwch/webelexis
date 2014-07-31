package ch.rgw.elexis.konsdecorator.base

import scala.util.matching.Regex

// name,label,width,height
class Decoration(name: String, label: String) {
  var offset = 0
  var length = 0
  def getLabel=label
  def getName=name
}