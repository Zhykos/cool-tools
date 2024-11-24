from locust import HttpUser, task, constant

class BenchmarkOpenTelemetryCollector(HttpUser):
    wait_time = constant(1)

    @task
    def benchmark(self):
        self.client.get("/benchmark")
