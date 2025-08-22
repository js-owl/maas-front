import { createWebHistory, createRouter } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
import { useAuthStore } from "./stores/auth.store";

const routes = [
  { path: "/", component: HomePage, name: "home" },
  {
    path: "/mechanical",
    component: () => import("./pages/MechanicalPage.vue"),
  },
  {
    path: "/composite",
    component: () => import("./pages/CompositePage.vue"),
  },
  {
    path: "/painting",
    component: () => import("./pages/PaintingPage.vue"),
  },
  {
    path: "/machining",
    component: () => import("./pages/CalculateMachiningPage.vue"),
    name: "machining",
  },
  { path: "/milling", component: () => import("./pages/MillingPage.vue") },
  {
    path: "/plastic",
    component: () => import("./pages/CalculatePlasticPage.vue"),
  },
  { path: "/paint", component: () => import("./pages/CalculatePaintPage.vue") },
  // @ts-ignore
  { path: "/cad", component: () => import("./pages/CadPage.vue") },
  {
    path: "/order-list",
    // @ts-ignore
    component: () => import("./pages/OrderListPage.vue"),
    name: "order-list",
  },

  { path: "/:patchMatch(.*)*", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  console.log("router", { to }, authStore.getToken);
  // if (!authStore.getToken && to.name != "home") {
  //   return { name: "home" };
  // }
});

export default router;
