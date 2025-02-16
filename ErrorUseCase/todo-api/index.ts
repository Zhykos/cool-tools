import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import winston from "npm:winston";
import { SeqTransport } from "npm:@datalust/winston-seq";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "error-case-195-backend" },
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

logger.add(
  new SeqTransport({
    serverUrl: Deno.env.get("SEQ_URL"),
    apiKey: Deno.env.get("SEQ_API_KEY"),
    onError: ((e: unknown) => {
      console.error(e);
    }),
  }),
);

interface ListItem {
  id: string;
  text: string;
}

const items: ListItem[] = [];

const router = new Router();

router.get("/todo", (ctx) => {
  const requestID: string = ctx.request.headers.get("X-Request-Id") ??
    "unknown";
  logger.info("Getting all todos", { requestID });
  ctx.response.body = items;
  ctx.response.headers.set("X-Request-Id", requestID);
});

router.post("/todo", async (ctx) => {
  const requestID: string = ctx.request.headers.get("X-Request-Id") ??
    "unknown";
  logger.info("Creating new todo", { requestID });
  const { text }: { text: string } = await ctx.request.body.json();

  if (text.includes("y")) {
    logger.error("Text includes 'y'", { requestID });
    ctx.response.status = 500;
    ctx.response.body = { error: "Text includes 'y'" };
    ctx.response.headers.set("X-Request-Id", requestID);

    return;
  }

  const id: string = Math.random().toString(16).slice(2);
  items.push({ id, text });
  logger.info(`Created new todo with id ${id}`, { requestID });
  ctx.response.body = { id };
  ctx.response.headers.set("X-Request-Id", requestID);
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening on http://localhost:8080");
app.listen({ port: 8080 });
