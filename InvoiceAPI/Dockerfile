FROM maven:3.9.8-eclipse-temurin-21-alpine AS maven_build

COPY pom.xml /build/
COPY src /build/src/
WORKDIR /build/

# Workaround for M4, Java 21, MacOS 15.2 bug: https://github.com/corretto/corretto-21/issues/85
RUN export MAVEN_OPTS="-XX:UseSVE=0" && mvn clean install -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=maven_build /build/target/ target/

EXPOSE 9005

# Workaround for M4, Java 21, MacOS 15.2 bug: https://github.com/corretto/corretto-21/issues/85
CMD ["java", "-XX:UseSVE=0", "-jar", "target/quarkus-app/quarkus-run.jar"]