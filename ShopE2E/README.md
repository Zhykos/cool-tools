# End-to-End (E2E) tests for the Shop and all services

This project contains the end-to-end tests for the Shop and all external services like databases, message brokers, and more.
It uses Docker Compose to run the services.

All services are described in the `docker-compose.yml` file, in the Infra directory.

Tests are written in TypeScript and use the Playwright library to interact with the web application.

## Launch the tests

First, read the infrastructure README to set the IP address (check paragraph `Running the infrastructure`).

Then, initialize the project with the following command:

```bash
npm install
```

Then, you can run the tests with the following command:

```bash
docker compose up -d --build
npm run test
docker compose down -v
```

## Improvements

- I tried to use the `testcontainer` library to start the services in the tests, but somehow it didn't work.

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
