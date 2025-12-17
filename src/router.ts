import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'
// import { useAuthStore } from "./stores/auth.store";

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage, name: 'home' },
  {
    path: '/mechanical',
    component: () => import('./pages/MachiningPage.vue'),
  },
  {
    path: '/print',
    component: () => import('./pages/PrintingPage.vue'),
  },
  {
    path: '/painting',
    component: () => import('./pages/PaintingPage.vue'),
  },
  // {
  //   path: '/mach',
  //   component: () => import('./pages/MachiningPage.vue'),
  //   name: 'mach',
  // },
  {
    path: '/machining',
    component: () => import('./pages/CalculateMachiningPage.vue'),
    name: 'machining',
  },
  {
    path: '/machining2',
    component: () => import('./pages/CalculateMachiningPage.vue'),
    name: 'machining2',
  },
  {
    path: '/milling',
    component: () => import('./pages/CalculateMillingPage.vue'),
    name: 'milling',
  },
  // {
  //   path: '/milling2',
  //   component: () => import('./pages/CalculateMillingPage.vue'),
  //   name: 'milling2',
  // },
  {
    path: '/printing',
    component: () => import('./pages/CalculatePrintingPage.vue'),
    name: 'printing',
  },

  {
    path: '/personal',
    component: () => import('./pages/PersonalPage.vue'),
    children: [
      { path: '', redirect: { name: 'personal-profile' } },
      {
        path: 'profile',
        component: () => import('./components/PersonalProfile.vue'),
        name: 'personal-profile',
      },
      {
        path: 'orders',
        component: () => import('./components/PersonalOrders.vue'),
        name: 'personal-orders',
      },
      {
        path: 'order',
        component: () => import('./components/PersonalOrder.vue'),
        name: 'personal-order',
      },
      {
        path: 'calc-info',
        component: () => import('./components/PersonalCalcInfo.vue'),
        name: 'personal-calc-info',
      },
      {
        path: 'calc',
        component: () => import('./components/PersonalCalc.vue'),
        name: 'personal-calc',
      },
      {
        path: 'users',
        component: () => import('./components/PersonalUsers.vue'),
        name: 'personal-users',
      },
    ],
    name: 'personal',
  },
  {
    path: '/license',
    component: () => import('./pages/LicensePage.vue'),
    name: 'license',
  },
  {
    path: '/offer-client',
    component: () => import('./pages/OfferClientPage.vue'),
    name: 'offer-client',
  },

  { path: '/:patchMatch(.*)*', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 0, behavior: 'smooth' }
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to) => {
  // const authStore = useAuthStore();
  console.log('router', to.fullPath)
  // if (!authStore.getToken && to.name != "home") {
  //   return { name: "home" };
  // }
})

export default router
