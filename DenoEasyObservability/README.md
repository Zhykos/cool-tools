# Deno Easy Observability: how to use Deno with OpenTelemetry wihtout pain

Recently (february 2025), Deno has released a new version with built-in OpenTelemetry support.
This is a beta and unstable feature, but it is a good opportunity to discover how to use OpenTelemetry with Deno.

Deno announce: https://deno.com/blog/v2.2#built-in-opentelemetry

The project is composed of two directories:
- A backend service, made with Deno, which is a simple REST API.
- A End-to-End (E2E) test service, made with TypeScript and Playwright, which is used to interact with the API.

To check logs and traces, the project uses the LGTM stack (Loki, Grafana, Mimir and Tempo):
- Loki: a log aggregation system
- Grafana: a visualization tool
- Mimir: not sure if I use it correctly (it's a distributed database for Loki)
- Tempo: a tracing service

Everything uses OpenTelemetry to collect observability data.

## Links and directories

- [Backend service directory](./api/): the backend service, made with [Deno](https://deno.land/)
- [E2E directory](./e2e/): the end-to-end tests, made with [Playwright](https://playwright.dev/)
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/): the tool to collect traces and send them to the tracing service
- [LGMT](https://grafana.com/go/webinar/getting-started-with-grafana-lgtm-stack/): the observability stack used in this project

## Launch the services

### Launch the infrastructure services with Docker

To launch the services, you need to have Docker installed on your machine.

To launch the services, run the following command:

```bash
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti -e GF_PATHS_DATA=/data/grafana docker.io/grafana/otel-lgtm:0.8.1
```

### Launch the backend service

To launch the backend service, you need to have Deno installed on your machine.

To launch the backend service, run the following command in the `api` directory:

```bash
deno task start
```

## Verify the logs and traces

Open your browser and go to the Grafana interface at `http://localhost:3000/`.

Logs and metrics are available in the `Explore` section.

Traces can be found from a log.

## Launch the tests to verify the logs and traces

To launch the tests, you need to have Node.js installed on your machine.

To launch the tests, run the following command in the `e2e` directory:

```bash
npm install
npm run test
```

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code
of conduct, and the process for submitting pull requests to us.

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning.

## Authors

- **Thomas Cicognani** - *First version* -
  [Zhykos](https://github.com/Zhykos)

## Acknowledgments

- PurpleBooth 🖤 for the README template: https://github.com/PurpleBooth/a-good-readme-template
- Hat tip to anyone whose code is used
