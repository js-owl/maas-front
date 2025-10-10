import { createWebHistory, createRouter } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
// import { useAuthStore } from "./stores/auth.store";

const routes = [
  { path: "/", component: HomePage, name: "home" },
  {
    path: "/mechanical",
    // @ts-ignore
    component: () => import("./pages/MachiningPage.vue"),
  },
  {
    path: "/composite",
    // @ts-ignore
    component: () => import("./pages/CompositePage.vue"),
  },
  {
    path: "/painting",
    // @ts-ignore
    component: () => import("./pages/PaintingPage.vue"),
  },
  {
    path: "/mach",
    // @ts-ignore
    component: () => import("./pages/MachiningPage.vue"),
    name: "mach",
  },
  {
    path: "/machining",
    // @ts-ignore
    component: () => import("./pages/CalculateMachiningPage.vue"),
    name: "machining",
  },
  {
    path: "/machining2",
    // @ts-ignore
    component: () => import("./pages/CalculateMachiningPage2.vue"),
    name: "machining2",
  },
  {
    path: "/milling",
    // @ts-ignore
    component: () => import("./pages/CalculateMillingPage.vue"),
    name: "milling",
  },
  {
    path: "/milling2",
    // @ts-ignore
    component: () => import("./pages/CalculateMillingPage2.vue"),
    name: "milling2",
  },
  {
    path: "/printing",
    // @ts-ignore
    component: () => import("./pages/CalculatePrintingPage.vue"),
    name: "printing",
  },
  {
    path: "/order-list",
    // @ts-ignore
    component: () => import("./pages/OrderListPage.vue"),
    name: "order-list",
  },
  {
    path: "/profile",
    // @ts-ignore
    component: () => import("./pages/ProfilePage.vue"),
    name: "profile",
  },
  {
    path: "/license",
    // @ts-ignore
    component: () => import("./pages/LicensePage.vue"),
    name: "license",
  },

  { path: "/:patchMatch(.*)*", component: NotFoundPage },
];

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to: any) => {
  // const authStore = useAuthStore();
  console.log("router", to.fullPath);
  // if (!authStore.getToken && to.name != "home") {
  //   return { name: "home" };
  // }
});

export default router;
