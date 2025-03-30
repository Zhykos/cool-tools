# End-to-End (E2E) tests for the Error Use Case and all services

This project contains the end-to-end tests for the Error Use Case and all external services like Seq and Zipkin.
It uses Docker Compose to run the services.

Tests are written in TypeScript and use the Playwright library to interact with the web application.

## Launch the tests

Initialize the project with the following command:

```bash
npm install
```

Then, you can run the tests with the following command:

```bash
cd ./tests/resources/
docker compose up -d --build
```

In another terminal,to execute the tests, run:

```bash
npm run test
```

Then, in the first terminal, run the following command to end the infrastructure:

```bash
docker compose down -v
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
