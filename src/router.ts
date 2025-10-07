import { createWebHistory, createRouter } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
// import { useAuthStore } from "./stores/auth.store";

const routes = [
  { path: "/", component: HomePage, name: "home" },
  {
    path: "/mechanical",
    component: () => import("./pages/MachiningPage.vue"),
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
    path: "/mach",
    component: () => import("./pages/MachiningPage.vue"),
    name: "mach",
  },
  {
    path: "/machining",
    component: () => import("./pages/CalculateMachiningPage.vue"),
    name: "machining",
  },
  {
    path: "/machining2",
    component: () => import("./pages/CalculateMachiningPage2.vue"),
    name: "machining2",
  },
  {
    path: "/milling",
    component: () => import("./pages/CalculateMillingPage.vue"),
    name: "milling",
  },
  {
    path: "/milling2",
    component: () => import("./pages/CalculateMillingPage2.vue"),
    name: "milling2",
  },
  {
    path: "/printing",
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
    path: "/stp",
    // @ts-ignore
    component: () => import("./components/STPViewer.vue"),
    name: "profile",
  },

  { path: "/:patchMatch(.*)*", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  // const authStore = useAuthStore();
  console.log("router", to.fullPath);
  // if (!authStore.getToken && to.name != "home") {
  //   return { name: "home" };
  // }
});

export default router;
