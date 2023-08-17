// Composables
import { createRouter, createWebHistory } from 'vue-router'

const isUserLoggedIn = () =>
  !!(localStorage.getItem('userData') && localStorage.getItem('accessToken'))

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ '@/views/Home.vue')
      },
      {
        path: '/ticket',
        name: 'Ticket',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ '@/views/Ticket/index.vue')
      },
      {
        path: '/ticket/:id',
        name: 'Ticket-id',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ '@/views/Ticket/[id].vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ '@/views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (to.meta['justDoIt']) return next()
  // this pages don't need authorization and user role or admin permission
  const auth = to.name !== 'Login' && to.name !== 'LoginTicket'

  if (!auth) {
    if (!isLoggedIn) {
      return next()
    }
    return next({ name: 'Home' })
  }
  // page  does require auth
  else if (auth) {
    if (isLoggedIn) return next()
    return next({ name: 'Login' })
  }
})
export default router
