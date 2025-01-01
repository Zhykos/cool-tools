FROM maven:3.9.8-eclipse-temurin-21-alpine AS maven_build

COPY pom.xml /build/
COPY src /build/src/

WORKDIR /build/

# Workaround for M4, Java 21, MacOS 15.2 bug: https://github.com/corretto/corretto-21/issues/85
RUN export MAVEN_OPTS="-XX:UseSVE=0" && mvn clean install -DskipTests

FROM ubuntu:24.04

RUN apt-get update && \
    apt-get -qy full-upgrade && \
    apt-get install -qy curl && \
    apt-get install -qy openjdk-21-jdk && \
    curl -sSL https://get.docker.com/ | sh

WORKDIR /app

COPY --from=maven_build /build/target/ target/

COPY export-papermerge-token.sh export-papermerge-token.sh
RUN chmod +x export-papermerge-token.sh

EXPOSE 9005

# Workaround for M4, Java 21, MacOS 15.2 bug: https://github.com/corretto/corretto-21/issues/85
CMD /bin/bash ./export-papermerge-token.sh > token.txt && cat token.txt && java -XX:UseSVE=0 -jar target/quarkus-app/quarkus-run.jar