import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'
// import { useAuthStore } from "./stores/auth.store";

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage, name: 'home' },
  {
    path: '/mechanical',
    component: () => import('./pages/UslugiMechPage.vue'),
  },
  {
    path: '/print',
    component: () => import('./pages/UslugiPrintPage.vue'),
  },
  {
    path: '/pkm',
    component: () => import('./pages/UslugiPKMPage.vue'),
  },
  {
    path: '/painting',
    component: () => import('./pages/UslugiPaintPage.vue'),
  },
  {
    path: '/test',
    component: () => import('./pages/UslugiTestPage.vue'),
  },
  {
    path: '/testing',
    component: () => import('./pages/TestingPage.vue'),
  },
  {
    path: '/galv',
    component: () => import('./pages/UslugiGalvPage.vue'),
  },
  {
    path: '/weld',
    component: () => import('./pages/UslugiWeldPage.vue'),
  },
  {
    path: '/rubber',
    component: () => import('./pages/UslugiRubberPage.vue'),
  },
  {
    path: '/other',
    component: () => import('./pages/CalculateOtherPage.vue'),
    name: 'machining',
  },
  {
    path: '/machining2',
    component: () => import('./pages/CalculateOtherPage.vue'),
    name: 'machining2',
  },
  {
    path: '/milling',
    component: () => import('./pages/CalculateMillingPage.vue'),
    name: 'milling',
  },
  {
    path: '/milling2',
    component: () => import('./pages/CalculateMillingPage2.vue'),
    name: 'milling2',
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
        path: 'calcs',
        component: () => import('./components/PersonalCalcs.vue'),
        name: 'personal-calcs',
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
    component: () => import('./pages/FooterLicensePage.vue'),
    name: 'license',
  },
  {
    path: '/offer-client',
    component: () => import('./pages/FooterOfferPage.vue'),
    name: 'offer-client',
  },
  {
    path: '/policy',
    component: () => import('./pages/FooterPolicyPage.vue'),
    name: 'policy',
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
