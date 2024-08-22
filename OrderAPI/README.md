```bash
go build
```

Edit /etc/hosts file and add the following line:
```
127.0.0.1 kafka
```

```bash
MONGODB_URI="mongodb://root:password@localhost:9014" USER_API_URI="http://localhost:9001" PRODUCT_API_URI="http://localhost:9002" OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318" KAFKA_URI="kafka:9092" ./OrderAPI
```

to send a message to kafka, you can use the following command:
```bash
docker compose exec kafka kafka-console-producer.sh --topic orders --broker-list kafka:9092
```