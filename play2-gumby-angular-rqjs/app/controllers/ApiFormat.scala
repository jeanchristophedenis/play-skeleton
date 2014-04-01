package controllers

import org.joda.time.format.DateTimeFormat
import org.joda.time.DateTime
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.BSONFormats._
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import play.api.libs.json.JsString

trait ApiFormat {

  implicit val datetimeFormat = utils.DateFormatter.apiDatetimeFormat

  val idField: Symbol = 'id

  val validateNotEmptyJsString = Reads.verifying( (jsStr: JsString) => !jsStr.value.isEmpty )
  val validateNotEmptyString = Reads.verifying( (str: String) => !str.isEmpty )
  val validateBSONIDFormat = Reads.verifying( (jsStr: JsString) => BSONObjectID.parse(jsStr.value).isSuccess)
  def validateOneOfTheList(list: List[String]) = Reads.verifying( (jsStr: JsString) => list.contains(jsStr.value) )

  val checkValidEmail = (__ \'email).read(email)

  def isNonEmptyString(field: Symbol) = (__ \field).read[String](validateNotEmptyString)

  val stringifyOID = __.json.update((__ \ idField).json.copyFrom( (__ \ '_id \ '$oid).json.pick )) andThen (__ \ '_id).json.prune
  def stringifyOIDField(fieldName: Symbol) = __.json.update((__ \ fieldName).json.copyFrom( (__ \ fieldName \ '$oid).json.pick ))
  def addOID = __.json.update((__ \ '_id).json.put(Json.toJson(BSONObjectID.generate)))
  def addOID(oid: BSONObjectID) = __.json.update((__ \ '_id \ '$oid).json.put(JsString(oid.stringify))) andThen (__ \ idField).json.prune

  def transformOIDField(field: Symbol) = {
    __.json.update(( __ \ field).json.copyFrom(
      (__ \ field).json.pick(validateBSONIDFormat andKeep of[JsString].map { jsString => Json.obj("$oid" -> jsString.value) }))
    )
  }

  def mergeJsErrors(errors: Seq[Option[JsError]]):Option[JsError] = errors.flatten.reduceLeftOption( (a, b) => a ++ b )

}