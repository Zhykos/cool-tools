# Error use case demonstration: logs and traces

This project demonstrates how to log and trace errors in a small frontend - backend architecture.
It uses Docker Compose to run the services.

The architecture is composed of two services:
- A frontend service, which is a simple web application made with Qwik, a React-like library.
- A backend service, which is a simple API made with Deno and oak.

Demo is based on a simple todo list application.

Infrastructure services:
- A logging service, which is Seq, a log management tool.
- A tracing service, which is Zipkin, a distributed tracing tool.
- OpenTelemetry Collector, which is a tool to collect traces (in this example) and send them to the tracing service.

All infrastructure services are described in the `docker-compose.yml` file.

Tests are written in TypeScript and use the Playwright library to interact with the web application.

## Links and directories

- [Frontend service directory](./front/): the frontend service, made with [Qwik](https://qwik.dev/)
- [Backend service directory](./todo-api/): the backend service, made with [Deno](https://deno.land/) and [Oak](https://oakserver.org/)
- Backend librairies downloaded from [jsr](https://jsr.io/) and [npm](https://www.npmjs.com/)
- [Seq](https://datalust.co/seq): the log management tool
- [Zipkin](https://zipkin.io/): the distributed tracing tool
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/): the tool to collect traces and send them to the tracing service

## Launch the services

### Launch the infrastructure services with Docker Compose

To launch the services, you need to have Docker and Docker Compose installed on your machine.

To launch the services, run the following command in the root directory of the project:

```bash
docker compose up -d
```

This command will launch the services in the background.

To stop the services, run the following command in the root directory of the project:

```bash
docker compose down -v
```

### Launch the logger service

You must have Docker installed on your machine.

Run the following command to launch Seq:

```bash
docker run --name seq -d --restart unless-stopped -e ACCEPT_EULA=Y -p 5341:80 datalust/seq:latest
```

### Launch the backend service

To launch the backend service, you need to have Deno installed on your machine.

To launch the backend service, run the following command in the `todo-api` directory:

```bash
deno task start
```

### Launch the frontend service

To launch the frontend service, you need to have Node.js installed on your machine.

To launch the frontend service, run the following command in the `front` directory:

```bash
npm install
npm run start
```

The frontend service will be available at `http://localhost:5173/`. Then you can interact with the web application.

The TODO application is a simple list of tasks. You can add and get tasks. It is available at `http://localhost:5173/demo/todolist/`.

To generate an error, you can add a task with a character `y`.

## Verify the logs and traces

### Verify the logs with Seq

To verify the logs, you can go to the Seq interface at `http://localhost:5341/`.

### Verify the traces with Zipkin

Check the Zipkin interface at `http://localhost:9411/`.

## Step by step: discover the logs and traces

Some git tags are available to help you discover the logs and traces.

Tags:
- step 01: no way to know if the log is from the frontend or backend
- step 02: service name to know if the log is from the frontend or backend
- step 03: use case which returns an error 500
- step 04: log the error, server side
- step 05: create traceId-ish
- step 06: add OpenTelemetry auto-instrumentation in frontend
- step 07: use real OpenTelemetry span in frontend and the logs now have the traceId
- step 08: full OpenTelemetry tracing (manual instrumentation)
- step 09: change the error case

## Launch the tests to verify the logs and traces

Read the README in [E2E directory](./e2e/) to know how to tests this project.

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
- https://opentelemetry.io/docs/languages/js/instrumentation/
