package ch.rgw.elexis.konsdecorator.base

class Value(name: String, label: String, pattern: String) extends Decoration(name, label){
	def getPattern = "".r
	def getLOINC=""
	  
}