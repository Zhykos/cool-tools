import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

interface ListItem {
  id: string;
  text: string;
}

const items: ListItem[] = [];

const router = new Router();

router.get("/todo", (ctx) => {
  ctx.response.body = items;
});

router.post("/todo", async (ctx) => {
  const { text }: { text: string } = await ctx.request.body.json();
  const id: string = Math.random().toString(16);
  items.push({ id, text });
  ctx.response.body = { id };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening on http://localhost:8080");
app.listen({ port: 8080 });
