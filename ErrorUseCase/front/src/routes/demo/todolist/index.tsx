import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
  routeAction$,
  zod$,
  z,
  Form,
  server$,
} from "@builder.io/qwik-city";
import styles from "./todolist.module.css";
import winston from "winston";
import { SeqTransport } from "@datalust/winston-seq";
import { Resource } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import opentelemetry, {type Span} from '@opentelemetry/api';
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import type { OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base';

const resource = Resource.default().merge(
  new Resource({
    [ATTR_SERVICE_NAME]: 'error-case-195-frontend',
    [ATTR_SERVICE_VERSION]: '0.1.0',
  }),
);

const exporterOpts: OTLPExporterNodeConfigBase = {};
    if (import.meta.env.PUBLIC_OPENTELEMETRY_COLLECTOR_URI) {
        exporterOpts.url = import.meta.env.PUBLIC_OPENTELEMETRY_COLLECTOR_URI;
    }

const provider = new WebTracerProvider({
  resource: resource,
});
const processor = new SimpleSpanProcessor(new OTLPTraceExporter(exporterOpts))
provider.addSpanProcessor(processor);

provider.register();

const tracer = opentelemetry.trace.getTracer(
  'error-case-195-frontend',
  '0.1.0',
);

interface ListItem {
  id: string;
  text: string;
}

export const list: ListItem[] = [];

let logger: winston.Logger | null = null;

const log = server$((message: string, existingRequestID?: string) => {
  if (!logger) {
    logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'error-case-195-frontend' },
      transports: [
        //
        // - Write all logs with importance level of `error` or higher to `error.log`
        //   (i.e., error, fatal, but not other levels)
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        //
        // - Write all logs with importance level of `info` or higher to `combined.log`
        //   (i.e., fatal, error, warn, and info, but not trace)
        //
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
    
    logger.add(new SeqTransport({
      serverUrl: import.meta.env.PUBLIC_SEQ_URL,
      apiKey: import.meta.env.PUBLIC_SEQ_API_KEY,
      onError: ((e: unknown) => { console.error(e) }),
    }));
  }

  const requestID: string = existingRequestID ? existingRequestID : Math.random().toString(16).slice(2);
  logger.info(message, { requestID });

  return requestID;
});

export const useListLoader = routeLoader$(async () => {
  return tracer.startActiveSpan('get todo list', async (span: Span) => {
    const requestID: string = await log('Loading todo list', span.spanContext().traceId);
    const res: Response = await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/todo`, {
      headers: {
        "X-Request-Id": requestID,
      },
    });
    const todos = await res.json();
    log(`Loaded todo list: ${JSON.stringify(todos)}`, span.spanContext().traceId);
    span.end();
    return todos as ListItem[];
  });
});

export const useAddToListAction = routeAction$(
  async (item) => {
    return tracer.startActiveSpan('create todo item', async (span: Span) => {
      const requestID: string = await log(`Adding todo item: ${JSON.stringify(item)}`, span.spanContext().traceId);

      const res: Response = await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": requestID,
        },
        body: JSON.stringify({text: item.text}),
      });

      const newTodo = await res.json();
      list.push(newTodo as ListItem);

      log(`Added todo item: ${JSON.stringify(newTodo)}`, requestID);

      span.end();
      return {
        success: true,
      };
    });    
  },
  zod$({
    text: z.string().trim().min(1),
  }),
);

export default component$(() => {
  const list = useListLoader();
  const action = useAddToListAction();

  return (
    <>
      <div class="container container-center">
        <h1>
          <span class="highlight">TODO</span> List
        </h1>
      </div>

      <div role="presentation" class="ellipsis" />

      <div class="container container-center">
        {list.value.length === 0 ? (
          <span class={styles.empty}>No items found</span>
        ) : (
          <ul class={styles.list}>
            {list.value.map((item) => (
              <li key={`items-${item.id}`}>{item.text}</li>
            ))}
          </ul>
        )}
      </div>

      <div class="container container-center">
        <p class={styles.hint}>
          Y does it fail?
        </p>

        <Form action={action} spaReset>
          <input type="text" name="text" required class={styles.input} />{" "}
          <button type="submit" class="button-dark">
            Add item
          </button>
        </Form>

        <p class={styles.hint}>
          PS: This little app works even when JavaScript is disabled.
        </p>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Qwik Todo List",
};
