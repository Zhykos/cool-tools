# Shop: order API - A microservice for the Cool Tools project

This is a simple microservice that simulates an order API of a shop.
It uses [Go](https://go.dev/).

An order represents a product, a user and a price.

The API has the following endpoints:

- `POST /order` - Create an order

Orders are stored in a MongoDB database.
It is linked to a Kafka topic to send messages to the `orders` topic.

The API is instrumented with [OpenTelemetry](https://opentelemetry.io/) to collect traces and metrics. The traces are sent to the OpenTelemetry Collector and the metrics are sent to Prometheus via the OpenTelemetry Collector.

Use this API to test the OpenTelemetry Collector and the OpenTelemetry Java agent with the main project.

## Getting Started

These instructions will give you a copy of the project and running on
your local machine for development and testing purposes.

### Prerequisites

Requirements for the software and other tools to build and run the API
- Go: https://go.dev/dl/

### Running the API

Be sure to start the [Docker Compose](../Infra/docker-compose.yml) environment in the main project, "Infra" directory, before running the API.

Somehow you need to edit the /etc/hosts file and add the following line: `127.0.0.1 kafka`.

Before running the API, you need to build the project. To build the project, use the following command:

```bash
go build
```

To run the API, use the following command:

```bash
MONGODB_URI="mongodb://root:password@localhost:9014" USER_API_URI="http://localhost:9001" PRODUCT_API_URI="http://localhost:9002" OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318" KAFKA_URI="kafka:9092" ./OrderAPI
```

It will start the API on port 9004 and connect to the OpenTelemetry Collector on port 4317.

If you want to manually send a message to Kafka, you can use the following command:

```bash
docker compose exec kafka kafka-console-producer.sh --topic orders --broker-list kafka:9092
```

## Improvements

- Better code quality, create packages, and refactor the code

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code
of conduct, and the process for submitting pull requests to us.

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning.

## Authors

- **Thomas Cicognani** - *First version of the API* -
  [Zhykos](https://github.com/Zhykos)

## Acknowledgments

- PurpleBooth 🖤 for the README template: https://github.com/PurpleBooth/a-good-readme-template
- Hat tip to anyone whose code is used
