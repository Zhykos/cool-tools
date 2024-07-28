To create the Docker image, run the following command:

```bash
sbt reload
```

```bash
sbt docker:publishLocal
```

To launch Java applications, run the following command:

```bash
sbt "run 9003" -DOTEL_SERVICE_NAME=basket -DOTEL_TRACES_EXPORTER=otlp -DOTEL_METRICS_EXPORTER=otlp -DOTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317 -J-Xms512m -J-Xmx2048m -J-javaagent:opentelemetry-javaagent.jar -J-server
```