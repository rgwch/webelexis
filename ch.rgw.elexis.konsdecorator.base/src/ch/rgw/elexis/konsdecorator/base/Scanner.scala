package ch.rgw.elexis.konsdecorator.base

import java.util.{ List => javalist }

import scala.collection.JavaConversions.asScalaBuffer
import scala.collection.JavaConversions

class Scanner(decorations: Seq[Decoration], text: String) {

  val segs = decorations.map(decoration => {
    decoration.offset = text.indexOf(decoration.getLabel)
    decoration
  }).filter(_.offset != -1).sortBy(_.offset)

  /* Some magic to allow use from Java code */
  def this(decs: javalist[Decoration], text: String) {
    this(asScalaBuffer(decs), text)
  }

  def getSegments: Seq[Segment] = segs.filter(_.isInstanceOf[Segment]).asInstanceOf[Seq[Segment]]

  def getValues: Seq[Value] = segs.filter(_.isInstanceOf[Value]).asInstanceOf[Seq[Value]]

}