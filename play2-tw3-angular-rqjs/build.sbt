import net.litola.SassPlugin

name := "play2-tw3-angular-rqjs"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  "org.reactivemongo" %% "play2-reactivemongo" % "0.10.2",
  "org.webjars" %% "webjars-play" % "2.2.1-2",
  "org.webjars" % "modernizr" % "2.6.2-1",
  "org.webjars" % "requirejs" % "2.1.11-1",
  "org.webjars" % "jquery" % "1.10.2-1",
  "org.webjars" % "angularjs" % "1.2.14",
  "org.webjars" % "typeaheadjs" % "0.9.3",
  "org.webjars" % "momentjs" % "2.3.1",
  cache
)

play.Project.playScalaSettings ++
  SassPlugin.sassSettings ++
  Seq(
    SassPlugin.sassOptions := Seq("--compass", "-r", "compass")
  )

// This tells Play to optimize this file and its dependencies
requireJs += "main.js"

requireJs += "app/main.js"

// The main config file
// See http://requirejs.org/docs/optimization.html#mainConfigFile
requireJsShim := "build.js"

// Jasmine configuration
seq(jasmineSettings : _*)

appJsDir <+= baseDirectory / "app/assets/javascripts"

appJsLibDir <+= baseDirectory / "test/assets/lib"

jasmineTestDir <+= baseDirectory / "test/assets"

jasmineConfFile <+= baseDirectory / "test/assets/test.dependencies.js"

jasmineRequireJsFile <+= baseDirectory / "test/assets/lib/require-2.1.11.js"

jasmineRequireConfFile <+= baseDirectory / "test/assets/require.conf.js"

(test in Test) <<= (test in Test) dependsOn (jasmine)

// Build info settings
buildInfoSettings

sourceGenerators in Compile <+= buildInfo

buildInfoKeys := Seq[BuildInfoKey](name, version, scalaVersion, sbtVersion)

buildInfoPackage := "org.alrouen.skeleton"

buildInfoKeys ++= Seq[BuildInfoKey](
  BuildInfoKey.map(name) { case (k, v) => "project" + k.capitalize -> v.capitalize },
  "builtAt" -> {
    val dtf = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ")
    dtf.format(new java.util.Date())
  },
  "buildTime" -> System.currentTimeMillis
)