# Cool tool - Benchmark OpenTelemetry Collector with Locust

This project provides a benchmark of the OpenTelemetry Collector. It uses a simple API which creates and returns string hashes.

The project is divided into two parts:
- [API](api/README.md) - A simple API that creates and returns string hashes
- [Benchmark](bench-locust/README.md) - A benchmark of the API using Locust

The API can be configured to send traces, logs and metrics to the OpenTelemetry Collector.

The benchmark allows us to test the performance of the API if the OpenTelemetry Collector is used or not.

## Getting Started

First, you need to start the [Docker Compose](../Infra/docker-compose.yml) environment in the main project, "Infra" directory.

Then, you can start the [API](api/README.md).

Finally, you can start the [benchmark](bench-locust/README.md).

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code
of conduct, and the process for submitting pull requests to us.

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning.

## Authors

- **Thomas Cicognani** - *First version of the benchmark* -
  [Zhykos](https://github.com/Zhykos)

## Acknowledgments

- PurpleBooth 🖤 for the README template: https://github.com/PurpleBooth/a-good-readme-template
- Hat tip to anyone whose code is used
- The world because I'm a bad person who uses CoPilot
