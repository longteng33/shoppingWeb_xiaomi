// 这是router的js文件
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // 动态的import,所以在前面不用通过import先引入
    // 这是通过懒加载的方式引入组件，这样的话，在打包的时候生成另一个js文件，
    // 在加载首页的时候，不会去加载这个js文件，等到我们要去使用到当前这个路由的时候，才会去加载
    // 这样对性能是有提高
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
  },
  {
    path: '/product',
    name: 'product',
    component: () => import(/* webpackChunkName: "product" */ '../views/product.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "cart" */ '../views/cart.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import(/* webpackChunkName: "checkout" */ '../views/checkout.vue'),
  },
  {
    path: '/confirm',
    name: 'confirm',
    component: () => import(/* webpackChunkName: "confirm" */ '../views/confirm.vue'),
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
  // mode:'history'
})

export default router
