import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../mona/Editor.vue') },
  { path: '/sub', component: () => import('../mona/Editor.vue') },
  { path: '/home/test', component: () => import('../mona/Editor.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
