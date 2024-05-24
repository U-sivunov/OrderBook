import { createRouter, createWebHistory } from 'vue-router'
import Settings from '../components/SettingsPage.vue'
import OrderBook from '../components/OrderBook.vue'

const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/order-book',
    name: 'OrderBook',
    component: OrderBook
  },
  {
    path: '/',
    redirect: '/settings'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
