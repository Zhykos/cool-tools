name := """basket-api"""
organization := "fr.zhykos.demo.opt"

version := "1.0.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.13.14"

libraryDependencies += guice
