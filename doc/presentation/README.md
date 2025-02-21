# A French presentation to illustrate logs, traces, metrics with OpenTelemetry

This project demonstrates how to create a presentation *PowerPoint like* with a simple code, thanks to reveal.js and Quarto.

The result is a HTML project after the build. It is checked with Docker and Playwright.

## Links and directories

- [reveals.js](https://revealjs.com/): an open source HTML presentation framework
- [Quarto](https://quarto.org/): an open-source scientific and technical publishing system

## Launch the presentation

To launch the presentation, defined in the file `presentation.qmd`, you need to have Quarto: https://quarto.org/docs/get-started/.

If you are using VS Code, you may download a dedicated Quarto plugin: https://quarto.org/docs/get-started/hello/vscode.html (other plugins are available).

Run the following commands in the root directory of the project:

```bash
quarto preview presentation.qmd
```

Then open your browser at `http://localhost:4216/` is it is not automatic.

## Launch the tests to verify the logs and traces

Tests to check if the presentation can be generated are done thanks to Playwright.

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
- Grant McDermott for the Quarto template: https://github.com/grantmcdermott/quarto-revealjs-clean
- Hat tip to anyone whose code is used
- The world because I'm a bad person who uses CoPilot
