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

interface ListItem {
  id: string;
  text: string;
}

export const list: ListItem[] = [];

let logger: winston.Logger | null = null;

const log = server$((message: string) => {
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

  logger.info(message);
});

export const useListLoader = routeLoader$(async () => {
  log('Loading todo list');
  const res: Response = await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/todo`);
  const todos = await res.json();
  log(`Loaded todo list: ${JSON.stringify(todos)}`);
  return todos as ListItem[];
});

export const useAddToListAction = routeAction$(
  async (item) => {
    log(`Adding todo item: ${JSON.stringify(item)}`);

    const res: Response = await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({text: item.text}),
    });

    const newTodo = await res.json();
    list.push(newTodo as ListItem);

    log(`Added todo item: ${JSON.stringify(newTodo)}`);

    return {
      success: true,
    };
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
