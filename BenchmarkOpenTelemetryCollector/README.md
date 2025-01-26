# Cool tool - Benchmark OpenTelemetry Collector with Locust

This project provides a benchmark of the OpenTelemetry Collector.
It uses a simple API which creates and returns string hashes.

The project is divided into two parts (read the README of each part for more details):
- [API](./api) - A simple API that creates and returns string hashes
- [Benchmark](./bench-locust) - A benchmark of the API using Locust

The API can be configured to send traces, logs and metrics to the OpenTelemetry Collector.

The benchmark allows us to test the performance of the API if the OpenTelemetry Collector is used or not.

## Getting Started

First, you need to start the [Docker Compose](../Infra/docker-compose.yml) environment in the main project, "Infra" directory.

Then, you can start the [API](./api).

Finally, you can start the [benchmark](./bench-locust).

## Running the tests

To run the tests, you need to start the [Docker Compose](../Infra/docker-compose.yml) environment in the main project, "Infra" directory.

Then, you can start the [API](./api).

Finally, you can start the [benchmark](./bench-locust).

All commands are (from project root):

```bash
# (1) Terminal 1: run the infrastructure (for OpenTelemetry Collector)
cd Infra
docker compose up -d

# (2) Terminal 2: run the API
cd BenchmarkOpenTelemetryCollector/api
mvn clean compile
mvn spring-boot:run

# (3) Terminal 3: run the benchmark
cd BenchmarkOpenTelemetryCollector/bench-locust
locust -f locustfile.py

# Open the web browser and go to `http://localhost:8089/` to start the test
# Set these values:
# * Number of users (peak concurrency): 10
# * Ramp up (users started/seconds): 10
# * Host: "http://localhost:8999"
# * Advanced options: 5m

# (4) Terminal 4: stop the application
# Press `Ctrl+C` in the terminal where the API is running

# (5) Terminal 5: run the API with OpenTelemetry Collector
mvn spring-boot:run -P otpc

# (6) Terminal 6: run the benchmark with OpenTelemetry Collector
# Open the web browser and go to `http://localhost:8089/` to start the test
```

## Results and analysis

You can find the results and analysis in the [doc](./doc) directory.
I run the benchmark on my local machine, a MacBook Pro 2024 with an M4 Pro chip.

The first file is a report of the benchmark without the OpenTelemetry Collector: [report-without-otel-collector](./doc/report_without_opentelemetry.html).

The second file is a report of the benchmark with the OpenTelemetry Collector: [report-with-otel-collector](./doc/report_with_opentelemetry.html).

It seems that the OpenTelemetry Collector has a small impact on the performance of the API, maybe because of my CPU.
More tests are needed to confirm this.

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
