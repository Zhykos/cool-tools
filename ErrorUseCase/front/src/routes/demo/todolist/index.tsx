import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
  routeAction$,
  zod$,
  z,
  Form,
} from "@builder.io/qwik-city";
import styles from "./todolist.module.css";

interface ListItem {
  id: string;
  text: string;
}

export const list: ListItem[] = [];

export const useListLoader = routeLoader$(async () => {
  const res: Response = await fetch(`http://localhost:8080/todo`);
  const todos = await res.json();
  return todos as ListItem[];
});

export const useAddToListAction = routeAction$(
  async (item) => {
    const res: Response = await fetch(`http://localhost:8080/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({text: item.text}),
    });

    const newTodo = await res.json();
    list.push(newTodo as ListItem);

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
