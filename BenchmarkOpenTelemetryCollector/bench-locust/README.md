# Benchmark with Locust

This benchmark is based on [Locust](https://locust.io/), an open-source load testing tool. It is used to simulate user traffic and measure the performance of the OpenTelemetry Collector.

## Installation

https://docs.locust.io/en/stable/installation.html

```bash
pip3 install locust
```

## Usage

```bash
locust
```

Then open the web browser and go to `http://localhost:8089/` to start the test.

Set "http://localhost:8999" as the target host and set the number of users and the spawn rate.