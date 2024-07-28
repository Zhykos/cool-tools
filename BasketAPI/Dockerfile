FROM sbtscala/scala-sbt:graalvm-community-21.0.2_1.10.1_3.4.2 as BUILD

COPY build.sbt /build/
COPY app /build/app/
COPY opentelemetry-javaagent.jar /build/
COPY project/build.properties /build/project/
COPY project/plugins.sbt /build/project/
COPY conf /build/conf/

WORKDIR /build/
RUN sbt clean compile -DskipTests

EXPOSE 9000

ENTRYPOINT ["sbt", "run", "-DOTEL_SERVICE_NAME=basket", "-DOTEL_TRACES_EXPORTER=otlp", "-DOTEL_METRICS_EXPORTER=otlp", "-DOTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317", "-J-Xms512m", "-J-Xmx2048m", "-J-javaagent:opentelemetry-javaagent.jar", "-J-server"]