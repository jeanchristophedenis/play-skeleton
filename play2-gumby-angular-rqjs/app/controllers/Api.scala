package controllers

import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._
import play.mvc.Http
import reactivemongo.bson.BSONObjectID
import reactivemongo.core.commands.LastError
import scala.concurrent.Future
import play.api.libs.json.{JsError, JsValue, Reads, Json}

trait Api extends Controller {

  def withNoCacheHeader[A](action: Action[A]) = Action.async(action.parser) { request =>  // on success we add Pragma & Cache-Control with "no-cache" to avoid caching issue on Safari & IE
    action(request).map { r => r.header.status match {
      case Http.Status.OK => r.withHeaders(CACHE_CONTROL -> "no-cache, no-store", PRAGMA -> "no-cache")
      case _ => r
    }}
  }

  def validateOID(id: String)(f: BSONObjectID => Future[SimpleResult]) = {
    BSONObjectID.parse(id).map(f) getOrElse(Future(BadRequest(Json.obj("error" -> "invalidBsonId"))))
  }

  def validateOIDs(ids: Tuple2[String, String])(f: (BSONObjectID, BSONObjectID) => Future[SimpleResult]) = {
    (for {
      id1 <- BSONObjectID.parse(ids._1)
      id2 <- BSONObjectID.parse(ids._2)
    } yield {
      f(id1, id2)
    }) getOrElse(Future(BadRequest(Json.obj("error" -> "invalidBsonId"))))

  }

  object InsertUpdateProcess {     //TODO: it works... but is there any way to write it in a better way ? less case class, ...

    def validateJson[T](jsonValidator: Reads[T])(implicit request: Request[JsValue]):ErrorChecker[T] = {
      ErrorChecker[T](jsonValidator)(request)
    }

    case class ErrorChecker[T](jsonValidator: Reads[T])(request: Request[JsValue]) {
      def preInsertCheck(errorChecker: T => Future[Option[JsError]]):Insert[T] = {
        Insert(jsonValidator, errorChecker)(request)
      }
    }

    case class Insert[T](jsonValidator: Reads[T], errorChecker: T => Future[Option[JsError]])(request: Request[JsValue]) {
      def insertWith(insertor: T => Future[LastError]):Future[Either[JsError, T]] = {

        request.body.validate(jsonValidator).map { case validObject => {

          for {
            mayBeLogicErrors <- errorChecker(validObject)
            insertAction <- if(mayBeLogicErrors.isDefined) {
              Future(Left(mayBeLogicErrors.get))
            } else {
              insertor(validObject).map { _ => Right(validObject) }   //TODO: manage LastError
            }
          } yield {
            insertAction
          }
        }}.recoverTotal(e => Future(Left(e)))
      }
    }

  }

}
