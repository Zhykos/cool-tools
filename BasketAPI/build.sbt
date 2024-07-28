name := """basket-api"""
organization := "fr.zhykos.demo.opt"

version := "1.0.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava, JavaAgent)

scalaVersion := "2.13.14"

libraryDependencies += guice

routesGenerator := InjectedRoutesGenerator

dockerExposedPorts := Seq(9000)
dockerBaseImage := "openjdk:21"

import com.typesafe.sbt.packager.docker.DockerChmodType
import com.typesafe.sbt.packager.docker.DockerPermissionStrategy
dockerChmodType := DockerChmodType.UserGroupWriteExecute
dockerPermissionStrategy := DockerPermissionStrategy.CopyChown

javaAgents += "io.opentelemetry.javaagent" % "opentelemetry-javaagent" % "1.11.0"
javaOptions += "-Dotel.javaagent.debug=true" //Debug OpenTelemetry Java agent

lazy val openTelemetrySpecific = {
  val version = "1.39.0"
  //val alphaVersion =  s"$version"
  Seq(
    "io.opentelemetry" % "opentelemetry-bom" % version pomOnly(),
    "io.opentelemetry" % "opentelemetry-api" % version,
    "io.opentelemetry" % "opentelemetry-sdk" % version,
    //"io.opentelemetry" % "opentelemetry-exporter-jaeger" % version,
    "io.opentelemetry" % "opentelemetry-sdk-extension-autoconfigure" % version,
    //"io.opentelemetry" % "opentelemetry-exporter-prometheus" % alphaVersion,
    "io.opentelemetry" % "opentelemetry-exporter-otlp" % version,

    "io.opentelemetry.javaagent" % "opentelemetry-javaagent" % "2.6.0" % "runtime"
  )
}
libraryDependencies ++= openTelemetrySpecific