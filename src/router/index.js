import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/view/Login.vue'
import Home from '@/view/home/Home.vue'
import Welcome from '@/view/home/Welcome.vue'
import Users from '@/view/home/Users.vue'
import Rights from '@/view/home/power/Rights.vue'
import Roles from '@/view/home/power/Roles.vue'
import Categories from '@/view/home/goods/GoodsCart.vue'
import GoodsParams from '@/view/home/goods/GoodsParams.vue'
import GoodsList from '@/view/home/goods/GoodsList.vue'
import AddGoods from '@/view/home/goods/AddGoods.vue'
import OrderManagement from '@/view/home/order/OrderManagement.vue'
import DataReport from '@/view/home/reports/DataReport.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    name: Home,
    component: Home,
    redirect: '/reports',
    children: [{
      path: '/welcome',
      name: Welcome,
      component: Welcome
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/rights',
      name: 'Rights',
      component: Rights
    },
    {
      path: '/roles',
      name: 'Roles',
      component: Roles
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
    },
    {
      path: '/params',
      name: 'GoodsParams',
      component: GoodsParams
    },
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/goods/add',
      name: 'AddGoods',
      component: AddGoods
    },
    {
      path: '/orders',
      name: 'OrderManagement',
      component: OrderManagement
    },
    {
      path: '/reports',
      name: 'DataReport',
      component: DataReport
    }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
