
import play.api.mvc.{Action, Results, RequestHeader}
import play.api.{Logger, Application, GlobalSettings}
import scala.concurrent.ExecutionContext
import ExecutionContext.Implicits.global
import models._


object Global extends GlobalSettings {

  override def onStart(app: Application) {
    Logger.info("starting skeleton, build at: "+utils.BuildInfo.buildAt)
    Logger.info("ensuring indexes...")

  }

  // to manage request with trailing slash
  override def onRouteRequest(request: RequestHeader) = {

    Some(request.path).filter(p => p.endsWith("/") && p != "/" ).map { p =>  // filter requests with path that are ending with '/' and not equal to root page '/'

    // Without redirect :
    //super.onRouteRequest(request.copy(path = p.dropRight(1)))

    // With redirect :
      Some(Action(Results.MovedPermanently(p.dropRight(1))))

    } getOrElse(super.onRouteRequest(request))

  }
}