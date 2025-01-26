import { createRouter, createWebHistory } from "vue-router";
import {nextTick} from 'vue';
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/shop",
      name: "shop",
      component: () => import("@/views/ShopView.vue"),
      meta: { title: "Shop" },
    },
  ],
});

router.afterEach((to, _) => {
  nextTick(() => {
    document.title = to.meta.title ? to.meta.title as string : "Vite App";
  });
})

export default router;
