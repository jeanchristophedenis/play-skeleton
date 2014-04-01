package models

import scala.concurrent.{Future, ExecutionContext}
import ExecutionContext.Implicits.global
import org.joda.time.DateTime
import play.modules.reactivemongo.json.collection.JSONCollection
import play.modules.reactivemongo.json.BSONFormats._
import reactivemongo.bson.BSONDocument
import reactivemongo.api.indexes.{Index, IndexType}
import reactivemongo.core.commands.{Aggregate, Count}
import play.api.libs.json._
import play.api.libs.json.JsSuccess
import play.api.libs.json.JsNumber

abstract class MongoModel[T: Format, ID: Format] {

  def collection: JSONCollection  

  //TODO : managing indexing from MongoModel
  def ensureIndexes: Future[List[Boolean]]

  def ensureIndex(
                   key: List[(String, IndexType)],
                   name: Option[String] = None,
                   unique: Boolean = false,
                   background: Boolean = false,
                   dropDups: Boolean = false,
                   sparse: Boolean = false,
                   version: Option[Int] = None,
                   options: BSONDocument = BSONDocument()) = {
    collection.indexesManager.ensure(Index(key, name, unique, background, dropDups, sparse, version, options))
  }

  def find(query: JsObject = Json.obj(), sort: JsObject = Json.obj(), limit: Int = Int.MaxValue): Future[List[T]] = {
    var builder =collection
      .find(query)

    if (!sort.keys.isEmpty)
      builder = builder.sort(sort)

    builder
      .cursor[T]
      .collect[List](upTo = limit)
  }

  def enumerate(query: JsObject = Json.obj(), sort: JsObject = Json.obj(), limit: Int = Int.MaxValue) = {
    var builder =collection
      .find(query)

    if (!sort.keys.isEmpty)
      builder = builder.sort(sort)

    builder
      .cursor[T].enumerate(maxDocs = limit)
  }

  def count(query: JsObject = Json.obj()): Future[Int] = {
    val doc = BSONDocumentFormat.reads(query).get
    collection.db.command(Count(collectionName = collection.name, query = Some(doc)))
  }

  def findOne(query: JsObject, sort: JsObject = Json.obj()): Future[Option[T]] =
    collection
      .find(query)
      .sort(sort)
      .one[T]

  def findAll(sort: JsObject = Json.obj(), limit: Int = Int.MaxValue) = find(query = Json.obj(), sort = sort, limit = limit)

  def enumerateAll(query: JsObject = Json.obj(), sort: JsObject = Json.obj(), limit: Int = Int.MaxValue) = enumerate(query = query, sort = sort, limit = limit)

  def findById(_id: ID): Future[Option[T]] = findOne(Json.obj("_id" -> _id))

  def insert(o: T) = collection.insert(o)

  def update(o: T) = collection.save(o)

  protected def update(query: JsObject, toUpdate: JsValue, upsert: Boolean = false, multi: Boolean = false) = collection.update(query, toUpdate, upsert = upsert, multi = multi)

  def remove(_id: ID) = collection.remove(Json.obj("_id" -> _id))

  def drop(): Future[Boolean] = collection.drop().recover { case _ => false }

}


object MongoFormat {
  implicit object DateTimeToBsonDate extends Format[DateTime] {
    def reads(jsDate: JsValue) = {
      jsDate.\("$date").asOpt[JsNumber].map { mayBeLong => JsSuccess(new DateTime(mayBeLong.value.toLong))}.getOrElse(JsError("invalid format"))
    }

    def writes(datetime: DateTime) = {
      Json.obj("$date" -> datetime.getMillis)
    }
  }
}