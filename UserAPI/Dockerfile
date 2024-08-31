FROM maven:3.9.8-eclipse-temurin-21-alpine AS maven_build

COPY pom.xml /build/
COPY src /build/src/

WORKDIR /build/
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=maven_build /build/target/user-api-1.0.0-SNAPSHOT.jar /app/
EXPOSE 9001
ENTRYPOINT ["java", "-jar", "user-api-1.0.0-SNAPSHOT.jar"]