import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SettingsView from '@/views/SettingsView.vue'
import ResultView from '@/views/ResultView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'AI髮型模擬器'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: '個人照片設定'
    }
  },
  {
    path: '/result/:id?',
    name: 'result',
    component: ResultView,
    meta: {
      title: '髮型效果'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'AI髮型模擬器'
  next()
})

export default router
