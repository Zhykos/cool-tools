# A French presentation to illustrate logs, traces, metrics with OpenTelemetry

This project demonstrates how to create a presentation *PowerPoint like* with a simple code, thanks to reveal.js.

The result is a HTML project after the build. It is checked with Docker and Playwright.

## Links and directories

- [reveals.js](https://revealjs.com/): a library to create presentations

## Launch the presentation

To launch the presentation, defined in the file `index.html`, you need to have Node.js.

Run the following commands in the root directory of the project:

```bash
npm install
npm run dev
```

Then open your browser at `http://localhost:5173/`.

## Launch the tests to verify the logs and traces

Run a Docker command:

```bash
docker build -t presentation .
docker run -d -p 3026:80 presentation
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
- The world because I'm a bad person who uses CoPilot
