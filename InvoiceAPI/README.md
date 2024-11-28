# Shop: invoice API - A microservice for the Cool Tools project

This is a simple microservice that simulates an invoice API of a shop.
It uses the [Quarkus Framework](https://quarkus.io/) and is written in Java.

An invoice represents a product, a user, a price, and an address.

The API has the following endpoints:

- `GET /invoice` - Get all invoices
- `POST /invoice` - Create a fake invoice
- `GET /{order_id}/download` - Download the invoice as a PDF

This API is the final step of the Cool Tools project shop.

It is linked to a Kafka topic to receive the order data.
Then it creates an invoice and sends it to the user via email with a PDF attachment.
The PDF is generated using the [iTextPDF](https://itextpdf.com/) library and is stored in a GED using the [Papermerge](https://papermerge.com/) software.

No email is really sent. The email is stored in a fake SMTP server, using the [inbucket](https://inbucket.org/) software.

The API is instrumented with [OpenTelemetry](https://opentelemetry.io/) to collect traces and metrics. The traces are sent to the OpenTelemetry Collector and the metrics are sent to Prometheus via the OpenTelemetry Collector.

Use this API to test the OpenTelemetry Collector and the OpenTelemetry Java agent with the main project.

## Getting Started

These instructions will give you a copy of the project and running on
your local machine for development and testing purposes.

### Prerequisites

Requirements for the software and other tools to build and run the API
- Java 21

### Running the API

Be sure to start the [Docker Compose](../Infra/docker-compose.yml) environment in the main project, "Infra" directory, before running the API.

Before launching the API, you need to get a token from the GED. To do so, run the following command:

```shell
docker ps
```

Then, copy the container ID of the GED and run the following command:

```shell
docker exec <DOCKER CONTAINER> create_token.sh admin
```

To run the API, use the following command:

```shell
./mvnw quarkus:dev -Dged.token=<TOKEN>
```

It will start the API on port 9005 and connect to the OpenTelemetry Collector on port 4317.

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
- The world because I'm a bad person who uses CoPilot
