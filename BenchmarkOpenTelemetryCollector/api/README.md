# Benchmark API - An application for the Cool Tools project

This is a simple applicate which is part of the Cool Tools project.

It is a simple API to test the [OpenTelemetry](https://opentelemetry.io/) Collector performance.

The API is built with Spring Boot and uses the OpenTelemetry to collect traces and metrics.

The API simply has a single endpoint which returns a list of items based on hashes (to explicitly take time to process).

The API has the following endpoints:

- `GET /benchmark` - Get a list of items

## Getting Started

These instructions will give you a copy of the project  and running on
your local machine for development and testing purposes.

### Prerequisites

Requirements for the software and other tools to build and run the API:
- Java 21

### Running the API

Compile the project with the following command:

```bash
mvn clean compile
```

Then, run the API with the following command:

```bash
mvn spring-boot:run
```

This will start the API on the port `8080`.

However, OpenTelemetry is not configured to send traces to the OpenTelemetry Collector.
To do so, you need to set the following environment variables:

```bash
mvn spring-boot:run -P otpc
```

This way you will be able to compare the performance of the API with and without the OpenTelemetry Collector.
