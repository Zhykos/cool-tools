name := """basket-api"""
organization := "fr.zhykos.demo.opt"

version := "1.0.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.13.14"

libraryDependencies += guice

routesGenerator := InjectedRoutesGenerator

dockerExposedPorts := Seq(9000)
dockerBaseImage := "openjdk:21"

import com.typesafe.sbt.packager.docker.DockerChmodType
import com.typesafe.sbt.packager.docker.DockerPermissionStrategy
dockerChmodType := DockerChmodType.UserGroupWriteExecute
dockerPermissionStrategy := DockerPermissionStrategy.CopyChown