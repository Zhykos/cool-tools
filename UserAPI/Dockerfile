FROM maven:3.9.8-eclipse-temurin-21-alpine AS MAVEN_BUILD

COPY pom.xml /build/
COPY src /build/src/

WORKDIR /build/
RUN mvn package

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=MAVEN_BUILD /build/target/user-1.0.0-SNAPSHOT.jar /app/
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "user-1.0.0-SNAPSHOT.jar", "--spring.profiles.active=json-logging"]