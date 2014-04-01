package models

import scala.concurrent.Future
import org.joda.time.DateTime
import reactivemongo.bson.{BSONRegex, BSONObjectID}
import reactivemongo.api.indexes.IndexType.Ascending
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json.BSONFormats._
import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection
import play.api.Play.current

/**
 * Created by alain on 31/03/2014.
 */
case class Todo(
  _id : BSONObjectID = BSONObjectID.generate,
  name : String,
  description : String,
  done : Boolean = false,
  createdAt : DateTime = new DateTime(),
  updatedAt : DateTime = new DateTime()
){}
object Todo {
  import MongoFormat.DateTimeToBsonDate
  implicit val todoFormat = Json.format[Todo]
}

object TodoDB extends MongoModel[Todo, BSONObjectID] {
  override def collection = ReactiveMongoPlugin.db.collection[JSONCollection]("todos")

  implicit val ec = play.api.libs.concurrent.Execution.Implicits.defaultContext

  override def ensureIndexes = {
    Future.sequence(List(
      ensureIndex(List("name" -> Ascending), unique = true)
    ))
  }

  def searchRegex(query: String ):BSONRegex = {

    // To generate this regex pattern:
    // we split the query into token with space and '-' character as separator
    // we then look for (token1 OR token2 OR ... OR lastToken)
    val tokens = query.split(Array(' ', '-')).foldLeft("") { (merge,token) => merge + """(?=.*\Q"""+token+"""\E)""" }
    BSONRegex(tokens, "i")
  }

  def search(query: String, sort: JsObject = Json.obj("name" -> 1)) = {

    val r = searchRegex(query)

    val regexQuery = Json.obj(
      "$or" -> Json.arr(
        Json.obj("name" -> r),  // looking for names that contains the query
        Json.obj("description" -> r)  // looking for descriptions that contains the query
      )
    )

    find(query = regexQuery, sort = sort, limit = 100)
  }

  def findByName(name: String) = findOne(Json.obj("name" -> name))


  def updateStatus(_id: BSONObjectID, isDone: Boolean) = {
    updateFields(_id, Json.obj("done" -> isDone))
  }

  private def updateFields(_id: BSONObjectID, field: JsObject) = {
    import MongoFormat.DateTimeToBsonDate
    update(
      Json.obj("_id" -> _id),
      Json.obj("$set" -> (field ++ Json.obj("updatedAt" -> new DateTime))),
      upsert = false,
      multi = false
    )
  }

}