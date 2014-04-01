// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

// Use the Play sbt plugin for Play projects
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2.2")

// Jasmine plugin
addSbtPlugin("com.joescii" % "sbt-jasmine-plugin" % "1.2.0")

// SASS plugin
addSbtPlugin("net.litola" % "play-sass" % "0.3.0")

// sbt-buildinfo plugin
addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.2.5")
