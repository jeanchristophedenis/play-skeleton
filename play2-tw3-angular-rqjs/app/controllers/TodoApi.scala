package controllers

import scala.concurrent.{Future, ExecutionContext}
import ExecutionContext.Implicits.global
import play.api.mvc._
import play.api.libs.json._
import models.{Todo, TodoDB}
import reactivemongo.bson.BSONObjectID
import play.api.data.validation.ValidationError
import org.joda.time.DateTime

/**
 * Created by alain on 31/03/2014.
 */
object TodoApi extends Api {

  def search(query: String) = Action.async {

    (if(query.isEmpty) {
      TodoDB.find(limit = 100)
    } else {
      TodoDB.search(query)
    }).map { markers => Ok(Json.toJson(markers)(Writes.seq(TodoFormat.todoApiWrites))) }

  }

  def nameExists(name: String) = Action.async {
    TodoDB.findByName(name).map {
      case Some(todo) => Ok(Json.obj("name" -> name, "alreadyExists" -> true))
      case _ => Ok(Json.obj("name" -> name, "alreadyExists" -> false))
    }
  }

  def get(id: String) = Action.async {
    validateOID(id) { markerId =>
      TodoDB.findById(markerId).map {
        case Some(marker) => Ok(Json.toJson(marker)((TodoFormat.todoApiWrites)))
        case _ => NotFound
      }
    }
  }

  def create = Action.async(parse.json) { implicit request =>

    import TodoFormat._

    def isNameConflict(todo: Todo):Future[Option[JsError]] = {
      TodoDB.findByName(todo.name).map {
        case Some(alreadyExistingTodo) => Some(todoNameAlreadyExistError)
        case _ => None
      }
    }

    InsertUpdateProcess
      .validateJson(todoApiReadForCreation)
      .preInsertCheck(isNameConflict(_))
      .insertWith(TodoDB.insert)
      .collect {
      case Right(todo) => Ok(Json.obj("id" -> todo._id.stringify))
      case Left(e) => BadRequest(Json.obj("error" -> JsError.toFlatJson(e)))
    }

  }

  def update(id: String) = Action.async(parse.json) { implicit request =>

    import TodoFormat._

    def isNameConflict(todo: Todo): Future[Option[JsError]] = {
      TodoDB.findByName(todo.name).map {
        case Some(alreadyExistingTodo) =>  if(todo._id != alreadyExistingTodo._id) Some(todoNameAlreadyExistError) else None
        case _ => None
      }
    }

    validateOID(id) { todoId =>
      TodoDB.findById(todoId).flatMap {
        case Some(todoToUpdate) =>
          InsertUpdateProcess
            .validateJson(todoApiReadForUpdate(todoToUpdate))
            .preInsertCheck(isNameConflict(_))
            .insertWith(TodoDB.update)
            .collect {
            case Right(user) => Ok
            case Left(e) => BadRequest(Json.obj("error" -> JsError.toFlatJson(e)))
          }
        case _ => Future(NotFound)
      }
    }
  }

  def updateStatus(id: String, status: Boolean) = Action.async {
    validateOID(id) { todoId =>
      TodoDB.updateStatus(todoId, status).map { _ => Ok }
    }
  }

  def delete(id: String) = Action.async {
    validateOID(id) { todoId =>
      TodoDB.remove(todoId).map { _ => Ok }
    }
  }

}

object TodoFormat extends ApiFormat {
  import play.modules.reactivemongo.json.BSONFormats._
  import utils.DateFormatter.DateFormat

  val todoNameAlreadyExistError = JsError( __ \'name ,ValidationError("validate.error.alreadyExist","name"))

  val todoApiWrites = Json.format[Todo].transform(_.transform(stringifyOID).get)

  val defaultValuesForTodoCreation = {
    val creationDate = new DateTime().apiFormat
    __.json.update((__ \ 'done).json.put(JsBoolean(false))) andThen
    __.json.update((__ \ 'createdAt).json.put(JsString(creationDate))) andThen
    __.json.update((__ \ 'updatedAt).json.put(JsString(creationDate)))
  }

  def mergeValuesForTodoUpdate(todo: Todo) = {
    addOID(todo._id) andThen
      __.json.update((__ \ 'createdAt).json.put(JsString(todo.createdAt.apiFormat))) andThen
      __.json.update((__ \ 'updatedAt).json.put(JsString(new DateTime().apiFormat)))
  }

  def todoApiReadForCreation = addOID andThen defaultValuesForTodoCreation andThen Json.reads[Todo]
  def todoApiReadForUpdate(todo: Todo) = mergeValuesForTodoUpdate(todo) andThen Json.reads[Todo]

}
