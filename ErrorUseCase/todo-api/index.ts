import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import winston from "npm:winston";
import { SeqTransport } from "npm:@datalust/winston-seq";
import { Resource } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import opentelemetry, { SpanStatusCode } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import type { OTLPExporterNodeConfigBase } from "@opentelemetry/otlp-exporter-base";
import {
  RandomIdGenerator,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";

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

const resource = Resource.default().merge(
  new Resource({
    [ATTR_SERVICE_NAME]: "error-case-195-backend",
    [ATTR_SERVICE_VERSION]: "0.1.0",
  }),
);

const exporterOpts: OTLPExporterNodeConfigBase = {};
if (Deno.env.get("OPENTELEMETRY_COLLECTOR_URI")) {
  exporterOpts.url = Deno.env.get("OPENTELEMETRY_COLLECTOR_URI");
}

const provider = new WebTracerProvider({
  resource: resource,
});
const processor = new SimpleSpanProcessor(new OTLPTraceExporter(exporterOpts));
provider.addSpanProcessor(processor);

provider.register();

const tracer = opentelemetry.trace.getTracer(
  "error-case-195-backend",
  "0.1.0",
);

interface ListItem {
  id: string;
  text: string;
}

const items: ListItem[] = [];

const router = new Router();

router.get("/todo", (ctx) => {
  const traceIdOpt: string = ctx.request.headers.get("X-Trace-Id-Opt") ??
    "unknown";
  const traceFlagsOpt: string = ctx.request.headers.get("X-Trace-Flags-Opt") ??
    "unknown";

  const externalContext = opentelemetry.trace.setSpan(
    opentelemetry.context.active(),
    opentelemetry.trace.wrapSpanContext({
      traceId: traceIdOpt,
      spanId: new RandomIdGenerator().generateSpanId(),
      isRemote: true,
      traceFlags: Number.parseInt(traceFlagsOpt),
    }),
  );
  const span = tracer.startSpan(
    "get todo list",
    undefined,
    externalContext,
  );

  logger.info("get todo list", { traceId: traceIdOpt });
  ctx.response.body = items;
  ctx.response.headers.set("X-Trace-Id-Opt", traceIdOpt);
  ctx.response.headers.set("X-Trace-Flags-Opt", traceFlagsOpt);

  span.end();
});

router.post("/todo", async (ctx) => {
  const traceIdOpt: string = ctx.request.headers.get("X-Trace-Id-Opt") ??
    "unknown";
  const traceFlagsOpt: string = ctx.request.headers.get("X-Trace-Flags-Opt") ??
    "unknown";

  const externalContext = opentelemetry.trace.setSpan(
    opentelemetry.context.active(),
    opentelemetry.trace.wrapSpanContext({
      traceId: traceIdOpt,
      spanId: new RandomIdGenerator().generateSpanId(),
      isRemote: true,
      traceFlags: Number.parseInt(traceFlagsOpt),
    }),
  );

  const span = tracer.startSpan(
    "create todo item",
    undefined,
    externalContext,
  );

  try {
    logger.info("create todo item", { traceId: traceIdOpt });

    const { text }: { text: string } = await ctx.request.body.json();

    fakeDatabaseAccess(span, text.includes("y"));

    // if (text.includes("y")) {
    //   logger.error("Text includes 'y'", { traceId: traceIdOpt });
    //   ctx.response.status = 500;
    //   ctx.response.body = { error: "Text includes 'y'" };
    //   ctx.response.headers.set("X-Trace-Id-Opt", traceIdOpt);
    //   ctx.response.headers.set("X-Trace-Flags-Opt", traceFlagsOpt);

    //   span.setStatus({
    //     code: SpanStatusCode.ERROR,
    //     message: "Text includes 'y'",
    //   });
    // } else {
    const id: string = Math.random().toString(16).slice(2);
    items.push({ id, text });
    logger.info(`Created new todo with id ${id}`, { traceId: traceIdOpt });
    ctx.response.body = { id };
    ctx.response.headers.set("X-Request-Id", traceIdOpt);
    ctx.response.headers.set("X-Trace-Flags-Opt", traceFlagsOpt);
    // }
  } finally {
    span.end();
  }
});

function fakeDatabaseAccess(
  parentSpan: opentelemetry.Span,
  generateError: boolean,
) {
  const externalContext = opentelemetry.trace.setSpan(
    opentelemetry.context.active(),
    parentSpan,
  );

  const span = tracer.startSpan(
    "fake database access",
    undefined,
    externalContext,
  );

  try {
    if (generateError) {
      throw new Error("Cannot access to database");
    }
  } catch (e) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: (e as Error).message,
    });
    span.addEvent("error", { error: (e as Error).message });
    throw e;
  } finally {
    span.end();
  }
}

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening on http://localhost:8080");
app.listen({ port: 8080 });
