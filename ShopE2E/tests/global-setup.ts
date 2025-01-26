import { DockerComposeEnvironment, Wait, type StartedDockerComposeEnvironment } from "testcontainers";

async function globalSetup() {
  // const environment: StartedDockerComposeEnvironment = await new DockerComposeEnvironment("/resources", "docker-compose.yml")
  //   .withWaitStrategy("redis-1", Wait.forLogMessage("Ready to accept connections"))
  //   .up();
}

export default globalSetup;
