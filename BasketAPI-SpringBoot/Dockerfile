FROM maven:3.9.8-eclipse-temurin-22-alpine AS maven_build

COPY pom.xml /build/
COPY src /build/src/

WORKDIR /build/

# Workaround for M4, Java 21, MacOS 15.2 bug: https://github.com/corretto/corretto-21/issues/85
RUN export MAVEN_OPTS="-XX:UseSVE=0" && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=maven_build /build/target/basket-api-1.0.0-SNAPSHOT.jar /app/
EXPOSE 9001

# Workaround for M4, Java 21, MacOS 15.2 bug: https://github.com/corretto/corretto-21/issues/85
CMD ["java", "-XX:UseSVE=0", "-jar", "basket-api-1.0.0-SNAPSHOT.jar"]