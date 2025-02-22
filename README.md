<h1 align="center">
  <br>
  <img src="./README-medias/growtika-yGQmjh2uOTg-unsplash.jpg" alt="cool tools by Zhykos" width="200" />
  <br>
  Cool tools
  <br>
</h1>

<h4 align="center">My selection of cool tools: frameworks, languages, tools, libraries, applications, software I think are cool. And are free.</h4>

<p align="center">
  <a href="#description">Description</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#authors">Authors</a> •
  <a href="#changelog">Changelog</a> •
  <a href="#credits">Credits</a> •
  <a href="#kudos">Kudos</a> •
  <a href="#license">License</a>
</p>

![Simplified architecture](./README-medias/simplified-arch.svg)

## Description

This project is my space to learn and experiment new things.
Some things already need to be improved, like the architecture, the performance, etc.
So, if you want to help me, to tell me new cools tools are released, I will be happy to work with you.

I started this project to learn about the OpenTelemetry project, when I heard about it.
I thought it was a cool project, and I wanted to learn more about it.

I tried to write articles about the tools OpenTelemetry in my previous jobs, but I never had the time to do it.
And when I had the time, the articles were not published...

So I made a project with a simple architecture and a little online shop.
I wrote some microservices, and I wanted to add the OpenTelemetry project to it.
And then it become bigger and bigger, a real project to try and learn new things.

Here are all the tools I used in this project:

<p align="center">
    <a href="https://prometheus.io/">Prometheus</a> • <a href="https://grafana.com/oss/loki/">Loki</a> • <a href="https://zipkin.io/">Zipkin</a> • <a href="https://grafana.com/">Grafana</a> • <a href="https://opentelemetry.io/">OpenTelemetry</a> • <a href="https://opentelemetry.io/docs/collector/">OpenTelemetry Collector</a> • <a href="https://www.h2database.com/">H2</a> • <a href="https://www.postgresql.org/">Postgres</a> • <a href="https://www.mongodb.com/">MongoDB</a> • <a href="https://zookeeper.apache.org/">Zookeeper</a> • <a href="https://kafka.apache.org/">Kafka</a> • <a href="https://docs.kafka-ui.provectus.io/">Kafka UI</a> •  <a href="https://www.papermerge.com/">Papermerge</a> • <a href="https://www.inbucket.org/">Inbucket</a> • <a href="https://konghq.com/">Kong</a> • <a href="https://excalidraw.com/">Excalidraw</a> • <a href="https://vuejs.org/">Vue.js</a> • <a href="https://www.playframework.com/">Play Framework</a> • <a href="https://quarkus.io/">Quarkus</a> • <a href="https://spring.io/projects/spring-boot">Spring Boot</a> • <a href="https://golang.org/">Go</a> • <a href="https://www.docker.com/">Docker</a> • <a href="https://docs.docker.com/compose/">Docker Compose</a> • <a href="https://www.usebruno.com/">Bruno</a> • <a href="https://plantuml.com/">PlantUML</a> • <a href="https://www.archimatetool.com/">Archimate</a> • <a href="https://locust.io/">Locust</a> • <a href="https://nodejs.org/">Node.js</a> • <a href="https://maven.apache.org/">Maven</a> • <a href="https://www.java.com/">Java</a> • <a href="https://playwright.dev/">Playwright</a> • <a href="https://deno.land/">Deno</a> • <a href="https://qwik.dev/">Qwik</a> • <a href="https://datalust.co/seq">Seq</a> • <a href="https://revealjs.com/">reveal.js</a> • <a href="https://quarto.org/">Quarto</a>
</p>

The project contains several directories (a README.md file is present in each directory):
* [BasketAPI](./BasketAPI/README.md): a simple API to manage a basket made with Play Framework
* [BenchmarkOpenTelemetryCollector](./BenchmarkOpenTelemetryCollector/README.md): a simple project to benchmark the OpenTelemetry Collector
* [ErrorUseCase](./ErrorUseCase/README.md): a simple backend - frontend architecture to demonstrate how to use logs and traces in case of errors
* [front-home](./front-home/README.md): a simple front-end to display the home page, made with Vue.js
* [Infra](./Infra/README.md): the infrastructure of the project, made with Docker Compose
* [InvoiceAPI](./InvoiceAPI/README.md): a simple API to manage invoices, made with Java and Quarkus
* [OrderAPI](./OrderAPI/README.md): a simple API to manage orders, made with Go
* [Observability presentation *PowerPoint like*](./Presentations/observability/README.md): a French presentation I may use to illustrate how to use OpenTelemetry through the Shop example and other stuffs
* [ProductAPI](./ProductAPI/README.md): a simple API to manage products, made with Java and Spring Boot (WebFlux)
* [ShopE2E](./ShopE2E/README.md): end-to-end tests for the Shop and all services
* [UserAPI](./UserAPI/README.md): a simple API to manage users, made with Java and Spring Boot.

You'll find a complete architecture documentation with the file [arch.plantuml](./arch.plantuml).
It uses the [PlantUML](https://plantuml.com/) language and [Archimate](https://www.archimatetool.com/) to describe the architecture.
Careful, I'm not an expert in Archimate, so the file may contain errors.

## How To Use

You will need Docker and Docker Compose to run this project.

Download and install Docker from [here](https://www.docker.com/get-started).

Then, to get the project, clone it with [Git](https://git-scm.com). From your command line:

```bash
# Clone this repository
git clone https://github.com/zhykos/cool-tools

# Go into the repository
cd cool-tools
```

### Run the complete shop example

To run the complete shop example and check if everything is working, run the following commands:

```bash
# (1) Start the Docker Compose: for more information, see the README.md file in the Infra directory
cd Infra
# But first, you need to get your IP address to configure Kong (the one where the Docker containers will be accessible)
ipconfig getifaddr en0 # Unix
# Use the IP address to configure Kong in the "kong/kong.yaml" file at line 36
-> "host: 192.168.1.140" for instance
# Then start the infrastructure
docker compose up -d

# Check if containers are running
docker ps

# Kong automatic configuration may not work, so you need to configure it manually
# But first, check if you have to configure it
# Open the URL: http://localhost:8002/ (should display the Kong Admin) and check the gateway services
# If you don't see the services, you need to configure it manually
# See the README.md file in the Infra directory for more information, at "Software infrastructure and tools / Details / Kong / Import configuration"
# Then check again Kong Admin if the gateway is displayed

# ---
# (2) Run the UserAPI
# Open a new terminal
# See the README.md file in the UserAPI directory for more information
# Requires Maven and Java 21
cd UserAPI
mvn clean test
mvn spring-boot:run

# Check if the UserAPI is running
# Open the URL: http://localhost:9001/actuator/health (status should be "UP")

# ---
# (3) Run the ProductAPI
# Open a new terminal
# See the README.md file in the ProductAPI directory for more information
# Requires Maven and Java 21
cd ProductAPI
mvn clean test
mvn spring-boot:run

# Check if the ProductAPI is running
# Open the URL: http://localhost:9002/actuator/health (status should be "UP")

# ---
# (4) Run the BasketAPI
# Open a new terminal
# See the README.md file in the BasketAPI directory for more information
# Requires sbt and Java 21
cd BasketAPI
sbt clean
sbt compile
sbt "run 9003" -DOTEL_SERVICE_NAME=basket -DOTEL_TRACES_EXPORTER=otlp -DOTEL_METRICS_EXPORTER=otlp -DOTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317 -J-Xms512m -J-Xmx2048m -J-javaagent:opentelemetry-javaagent.jar -J-server

# Check if the BasketAPI is running
# Open the URL: http://localhost:9003 (should display the available routes)

# ---
# (5) Run the OrderAPI
# Open a new terminal
# See the README.md file in the OrderAPI directory for more information
# Requires Go
cd OrderAPI
go build
MONGODB_URI="mongodb://root:password@localhost:9014" USER_API_URI="http://localhost:9001" PRODUCT_API_URI="http://localhost:9002" OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318" KAFKA_URI="kafka:9092" ./OrderAPI

# Check if the OrderAPI is running
# Open the URL: http://localhost:9004 (should display a 404 Not Found error)

# ---
# (6) Run the InvoiceAPI
# Open a new terminal
# See the README.md file in the InvoiceAPI directory for more information
# Requires Maven and Java 21
cd InvoiceAPI

# But first, you need to get a Papermerge token
# Get the Papermerge container ID
docker ps -aqf "name=papermerge-worker"

# Get the Papermerge token
docker exec <DOCKER CONTAINER> create_token.sh admin

# Run the InvoiceAPI
./mvnw clean compile
./mvnw quarkus:dev -Dged.token=<TOKEN>

# Check if the InvoiceAPI is running
# Open the URL: http://localhost:9005 (Quarkus UI should be displayed)

# ---
# (7) Run the front-home
# Open a new terminal
# See the README.md file in the front-home directory for more information
# Requires Node.js 21
cd front-home
npm install
npm run dev

# Click on displayed URL or open the URL: http://localhost:5173/ (should display the project home page).
# Then you can navigate through the website and go to the shop page: http://localhost:5173/shop
```

> **Note**: I was not able to run the tests on Firefox. Somehow, the `fetch` function always returns an error due to CORS and may be blocked by an extension (though it's ok on private mode).

You also can request APIs with [Bruno](https://www.usebruno.com/).
You'll find collections in `_bruno_` directories in each API directory and the `Infra` directory.

### Use the Shop

You can use the shop to add products to your basket, create an order, and generate an invoice.

> Sorry, the UI and UX of the shop are not perfect, it's just a simple example.

To do so, you need to:
* Go to the shop page: [http://localhost:5173/shop](http://localhost:5173/shop)
* Create a user
  * Fill the form with a username and click on the "Create user" button
* Select a user by clicking on a username in the list
  * The user is selected when the username is displayed in top of the page
* Select a product by clicking on a product in the list
  * The product is added to the basket: you can see the basket below the product list
* Create an order by clicking on the "Create order" button
* Download the invoice by clicking on the link presenting a PDF path.

### Check the applications

You can check the applications, if everything works correctly, with the following URLs:
* [Prometheus](http://localhost:9090/): it's a bit complicated to use, I won't explain how to use it here (because it's easier with Grafana), but you can check the metrics
* [Graphana](http://localhost:3000/): you can log in with the default credentials (admin/password) and check the dashboards (see the README.md file in the Infra directory for more information)
* [Zipkin](http://localhost:9411/): you can check the traces, click on "Find Traces" and you should see traces, click on one to see the details with the button "SHOW". For instance, display the traces of *"shop-frontend: click"* (21 sections) and you should see the traces of the front-end
* [Kafka UI](http://localhost:8085/): you can check the Kafka topics and messages
* [Papermerge](http://localhost:12000/): you can check the generated invoices (PDF files)
* [Inbucket](http://localhost:9000/): you can check the emails sent by the applications
* [Kong](http://localhost:8002/): you can check the API gateway

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code
of conduct, and the process for submitting pull requests to us.

## Authors

- **Thomas Cicognani** - *First version of the project* -
  [Zhykos](https://github.com/Zhykos)

## Changelog

- **1.0.0** - First version of the project: shop example, APIs and infrastructure
- **1.1.0** - Update lots of dependencies (thanks dependabot) and improve some E2E checks in the shop test

## Credits

Check credits in each directory.

Also:
- [README template](https://github.com/amitmerchant1990) by Amit Merchant
- I wish to not generate a header with IA so I used an image by <a href="https://unsplash.com/fr/@growtika">Growtika</a> on <a href="https://unsplash.com/fr/photos/un-ordinateur-avec-un-clavier-et-une-souris-yGQmjh2uOTg">Unsplash</a>
- Everyone, somehow, because I used Copilot to help me write the code

## Kudos

Documentation and articles I used and help me a lot to create this project:

* https://blog.ght1pc9kc.fr/2023/grafana-stack-1.-observabilit%C3%A9-avec-spring-boot-3/
* https://grafana.com/grafana/dashboards/17175-spring-boot-observability/
* https://ilaydadastan.com/log-analysis-and-visualization-with-grafana-loki-and-opentelemetry-7e3ea3c78895
* https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen
  * `telemetrygen traces --otlp-insecure --duration 50s`
* https://opentelemetry.io/docs/zero-code/java/spring-boot-starter/
* https://www.baeldung.com/ops/kafka-new-topic-docker-compose

## License

MIT: [LICENSE](./LICENSE) for more information.

---

> [zhykos.fr](https://www.zhykos.fr) &nbsp;&middot;&nbsp;
> GitHub [@zhykos](https://github.com/Zhykos) &nbsp;&middot;&nbsp;
> Bluesky [@zhykos](https://bsky.app/profile/zhykos.fr)
