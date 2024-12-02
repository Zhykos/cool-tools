# Shop: user API - A microservice for the Cool Tools project

This is a simple microservice that simulates a user API of a shop.
It uses Java and uses Spring Boot.

A user is a simple object with a name.

The API has the following endpoints:

- `GET /user` - List all users
- `POST /user` - Create a new user

Users are stored in a H2 database in memory.

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

To run the API, use the following command:

```bash
mvn spring-boot:run
```

It will start the API on port 9001 and connect to the OpenTelemetry Collector on port 4317.

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
