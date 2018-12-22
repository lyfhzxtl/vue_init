// 导入vue模块
import Vue from 'vue';
// 导入路由模块
import VueRouter from 'vue-router';
import store from './store';
// 引入组件,路由懒加载
const Home = () => import('./views/Home.vue');
const MyInfo = () => import('./views/MyInfo.vue');
const Login = () => import('./views/Login.vue');
// 安装路由模块
Vue.use(VueRouter);
// 配置路由规则、实例化路由
const router = new VueRouter({
  // mode: 'history',
  routes: [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    meta: {
      requireAuth: false
    },
    component: Home
  },
  {
    path: '/login',
    meta: {
      requireAuth: false
    },
    component: Login
  },
  // requireAuth: true 表示进入这个路由是需要登录的
  {
    path: '/myInfo',
    meta: {
      requireAuth: true
    },
    component: MyInfo
  },
  {
    path: '*',
    redirect: '/'
  }
  ]
});
router.beforeEach((to, from, next) => {
  let token = store.state.token;
  if ((to.meta.requireAuth && token) || !to.meta.requireAuth) {
    next();
  } else {
    next({
      path: '/login'
    })
  }
  if (from.path === '/login' && token) {
    next({
      path: '/home'
    })
  }
});
router.afterEach(() => {
  window.scrollTo(0, 0);
});
export default router;
