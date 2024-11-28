# Software infrastructure for the Cool Tools project

This project contains the infrastructure for the Cool Tools project.
It uses Docker Compose to run the services.

## Software infrastructure and tools

### Services list

The infrastructure consists of the following services:
- Prometheus: monitoring and alerting toolkit
- OpenTelemetry Collector: observability data collection and processing
- Loki: log aggregation system
- Grafana: visualization and monitoring tool
- Zipkin: distributed tracing system
- Postgres: relational database
- MongoDB: NoSQL database
- Zookeeper: distributed coordination service
- Kafka: distributed event streaming platform
- Kafka UI: web interface for Kafka
- Papermerge: document management system
- Fake SMTP: fake SMTP server for testing
- Kong: API gateway
- Excalidraw: whiteboard tool

### Details

Here are the details of the services.

#### Prometheus

// ============ TODO

#### OpenTelemetry Collector

// ============ TODO

#### Loki

// ============ TODO

#### Grafana

// ============ TODO

#### Zipkin

// ============ TODO

#### Postgres

// ============ TODO

#### MongoDB

// ============ TODO

#### Zookeeper

// ============ TODO

#### Kafka

// ============ TODO

#### Kafka UI

// ============ TODO

#### Papermerge

// ============ TODO

#### Fake SMTP

// ============ TODO

#### Kong

// ============ TODO

#### Excalidraw

// ============ TODO

## Getting Started

These instructions will give you a copy of the project and running on
your local machine for development and testing purposes.

### Prerequisites

Requirements for the software and other tools to build and run the API
- Docker and Docker Compose

### Running the infrastructure

Start the infrastructure with the following command:

```bash
export EXTERNAL_IP=$(ipconfig getifaddr en0) && docker compose up -d --build
```

## Improvements

- Well... it's just an infrastructure, so it's perfect! 😅

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





# Infrastructure documentation

```bash
export EXTERNAL_IP=$(ipconfig getifaddr en0) && docker compose up -d --build
```

## Kong

"Kong is an open-source API Gateway and Microservices Management Layer, delivering high performance and reliability."

### To backup and restore Kong configuration

Install deck: https://docs.konghq.com/deck/latest/installation/

Then: https://docs.konghq.com/deck/latest/guides/backup-restore/

Export configuration:

```bash
cd kong
deck gateway dump -o kong.yaml
```

Import configuration:

```bash
cd kong
deck gateway diff kong.yaml
deck gateway sync kong.yaml
```
