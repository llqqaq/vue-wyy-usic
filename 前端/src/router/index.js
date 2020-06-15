import Vue from 'vue'
import VueRouter from 'vue-router'
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommond'
  },
  {
    path: '/recommond',
    component: () => import('@/pages/recommond/recommond.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@/pages/disc/disc')
      }
    ]
  },
  {
    path: '/search',
    component: () => import('@/pages/search/search.vue')
  },
  {
    path: '/singer',
    component: () => import('@/pages/singer/singer.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@/pages/singer-detail/singer-detail')
      }
    ]
  },
  {
    path: '/rank',
    component: () => import('@/pages/rank/rank.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@/pages/top-list/top-list.vue')
      }
    ]
  },
  {
    path: '/user',
    component: () => import('@/pages/user-center/user-center.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router