package utils

import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import play.api.libs.json.{Writes, Reads, Format}

object DateTools {

  import scala.util.control.Exception._

  val apiPattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
  val iso8601WithMSecondFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
  val iso8601WithSecondFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ssZ")
  val iso8601Formatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mmZ")
  val rfc822Formatter = DateTimeFormat.forPattern("E, dd MMM yyyy HH:mm:ss Z")
  val simpleYMDhm = DateTimeFormat.forPattern("yyyy-MM-dd, HH:mm")
  val simpleYMD = DateTimeFormat.forPattern("yyyy-MM-dd")

  def toIso8601(date: DateTime) = iso8601Formatter.print(date)
  def toIso8601WithSecond(date: DateTime) = iso8601WithSecondFormatter.print(date)
  def toIso8601WithMSecond(date: DateTime) = iso8601WithMSecondFormatter.print(date)
  def toRfc822(date: DateTime) = rfc822Formatter.print(date)
  def toYMDhm(date: DateTime) = simpleYMDhm.print(date)
  def toYMD(date: DateTime) = simpleYMD.print(date)

  def parseYMD(date: String) = catching(classOf[IllegalArgumentException]) opt simpleYMD.parseDateTime(date)

}

object DateFormatter {

  val apiDatetimeFormat = Format[DateTime](
    Reads.jodaDateReads(DateTools.apiPattern),
    Writes.jodaDateWrites(DateTools.apiPattern)
  )

  implicit class DateFormat(val d: DateTime) {
    def rfc822 = DateTools.toRfc822(d)
    def iso8601 = DateTools.toIso8601(d)
    def iso8601withSecond = DateTools.toIso8601WithSecond(d)
    def iso8601withMSecond = DateTools.toIso8601WithMSecond(d)
    def apiFormat = DateTools.toIso8601WithMSecond(d)
    def ymdhm = DateTools.toYMDhm(d)
    def ymd = DateTools.toYMD(d)
  }

  implicit class DateParser(val s: String) {
    def parseYmd = DateTools.parseYMD(s)
  }

}
