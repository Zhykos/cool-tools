# opentelemetry-demo-microservices

## Run the demo

### Start the services and applications

For MacOS *(tested on M1 and Sonoma 14.5)*:

```shell
export EXTERNAL_IP=$(ipconfig getifaddr en0) && docker compose up -d --build
```

---

## Kudos

https://blog.ght1pc9kc.fr/2023/grafana-stack-1.-observabilit%C3%A9-avec-spring-boot-3/
https://grafana.com/grafana/dashboards/17175-spring-boot-observability/
https://ilaydadastan.com/log-analysis-and-visualization-with-grafana-loki-and-opentelemetry-7e3ea3c78895
https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen
telemetrygen traces --otlp-insecure --duration 50s
https://opentelemetry.io/docs/zero-code/java/spring-boot-starter/
https://www.baeldung.com/ops/kafka-new-topic-docker-compose