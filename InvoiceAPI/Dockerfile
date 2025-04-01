FROM maven:3.9.8-eclipse-temurin-22 AS maven_build

COPY pom.xml /build/
COPY src /build/src/
WORKDIR /build/

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=maven_build /build/target/ target/

EXPOSE 9005

CMD ["java", "-jar", "target/quarkus-app/quarkus-run.jar"]