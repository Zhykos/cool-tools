```bash
go build
```

```bash
MONGODB_URI=mongodb://root:password@localhost:9014 USER_API_URI=http://localhost:9001 PRODUCT_API_URI=http://localhost:9002 OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318" ./OrderAPI
```