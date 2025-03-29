# Cool tool - A frontend application made with Vue 3 and Vite

This project is a frontend application made with Vue 3 and Vite.
It is a simple application that represents a shop with users, products and a shopping cart.

This project is also configured with OpenTelemetry to send traces to the OpenTelemetry Collector.

## Getting Started

Be sure to start the [Docker Compose](../Infra/docker-compose.yml) environment in the main project, "Infra" directory, before running the application.

To run this project, you need to have Node.js installed on your machine (minimum version: 21).

Run the following commands to install the dependencies and start the application:

```bash
npm install
npm run dev
```

A local server will start on port 3000, and you can access the application at [http://localhost:3000](http://localhost:3000).

## Other commands (from official README)

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

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
