# Shop: basket API - A microservice for the Cool Tools project

This is a simple microservice that simulates a basket API of a shop. It uses the [Play Framework](https://www.playframework.com/) and is written in Java (not Scala).

A basket is a collection of items. Each item has a user id and a product id.

The API has the following endpoints:
    
- `GET /basket/:userId` - Get the basket for a user
- `POST /basket/:userId` - Add an item to the basket for a user
- `OPTIONS /basket/:userId` - Preflight request for [CORS](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)

The API is stateless and does not persist the basket data. The data is stored in memory and is lost when the service is restarted.

The API is instrumented with [OpenTelemetry](https://opentelemetry.io/) to collect traces and metrics. The traces are sent to the OpenTelemetry Collector and the metrics are sent to Prometheus via the OpenTelemetry Collector.

Use this API to test the OpenTelemetry Collector and the OpenTelemetry Java agent with the main project.

## Getting Started

These instructions will give you a copy of the project  and running on
your local machine for development and testing purposes.

### Prerequisites

Requirements for the software and other tools to build and run the API
- Java 21
- Play Framework (nothing to do): https://www.playframework.com/documentation/3.0.x/Requirements
    - But, you need to install the sbt tool: https://www.playframework.com/documentation/3.0.x/Requirements#Verifying-and-installing-sbt

### Running the API

Be sure to start the [Docker Compose](../Infra/docker-compose.yml) environment in the main project, "Infra" directory, before running the API.

The project does not need to be compiled before running the API. The Play Framework will compile the project automatically.

To run the API, use the following command:

```shell
sbt "run 9003" -DOTEL_SERVICE_NAME=basket -DOTEL_TRACES_EXPORTER=otlp -DOTEL_METRICS_EXPORTER=otlp -DOTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317 -J-Xms512m -J-Xmx2048m -J-javaagent:opentelemetry-javaagent.jar -J-server
```

It will start the API on port 9003 and connect to the OpenTelemetry Collector on port 4317.

### Running the API in Docker

To run the API in Docker, use the following command:

```shell
sbt reload
sbt docker:publishLocal
```

These commands will create a Docker file of the API.
Then, run the Docker image.
Note that you will need to update the OpenTelemetry Collector endpoint.

I'm not really sure OpenTelemetry works with Docker. I have not succeeded in making it work.

## Why Play Framework?

"Play Framework is a high-velocity web framework for Java and Scala. It is lightweight, stateless, and asynchronous. It is a good choice for microservices because it is easy to use and has good performance."

Well, that's what the Play Framework website says via CoPilot. I chose it because I use it at work and I think it is a good example to use the OpenTelemetry Java agent with a Java application.

However, I am not using Scala in this project. I am using Java because I am more familiar with it. Also, I think Play is too complex, that's why I am not using a database to store the basket data.

## Improvements

- Better code quality

## Notes

- The OpenTelemetry service name is set to `basket` to identify the service in the traces, but it does not work.

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
