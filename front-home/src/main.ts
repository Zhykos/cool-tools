import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { FrontendTracer } from "./FrontendTracer";
if (typeof window !== "undefined") {
  FrontendTracer();
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
