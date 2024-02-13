import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory('/vue2023-week6/'),
  routes: [
    {
      path: '/',
      name: 'frontView',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: '前台頁面',
      },
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/pages/HomePage.vue'),
        },
        {
          path: 'product/:id',
          name: 'product',
          component: () => import('@/views/pages/ProductDetailPage.vue'),
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: {
        title: '後台頁面',
      },
      children: [
        {
          path: '',
          name: 'dashboardHome',
          component: () => import('@/views/admin/HomePage.vue'),
        },
        {
          path: 'login',
          name: 'loginPage',
          component: () => import('@/views/admin/LoginPage.vue'),
        },
        {
          path: 'products',
          name: 'dashboardProducts',
          component: () => import('@/views/admin/ProductsPage.vue'),
        },
        {
          path: 'product/:id',
          name: 'dashboardProduct',
          component: () => import('@/views/admin/ProductDetailPage.vue'),
        },
        {
          path: 'coupons',
          name: 'dashboardCoupons',
          component: () => import('@/views/admin/CouponsPage.vue'),
        },
        {
          path: 'orders',
          name: 'dashboardOrders',
          component: () => import('@/views/admin/OrdersPage.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title}`;
  next();
});

export default router;
