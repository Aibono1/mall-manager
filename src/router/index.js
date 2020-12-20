import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'
// import Login from '@/components/login/login.vue'
// import Home from '@/components/home/home.vue'
// import Users from '@/components/users/users.vue'
// import Right from '@/components/rights/right.vue'
// import Role from '@/components/rights/role.vue'
// import GoodsList from '@/components/goods/goodslist.vue'
// import GoodsAdd from '@/components/goods/goodsadd.vue'
// import CateParams from '@/components/goods/cateparams.vue'
// import GoodsCate from '@/components/goods/goodscate.vue'
// import Orders from '@/components/order/order.vue'
// import Reports from '@/components/reports/reports.vue'

//路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home" */ '../components/login/login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home" */ '../components/home/home.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/users/users.vue')
const Right = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/rights/right.vue')
const Role = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/rights/role.vue')

const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/goodslist.vue')
const GoodsAdd = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/goodsadd.vue')

const GoodsCate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/goodscate.vue')
const CateParams = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/cateparams.vue')

const Orders = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/order.vue')
const Reports = () => import(/* webpackChunkName: "Order_Report" */ '../components/reports/reports.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{ 
        name: 'users', 
        path: 'users', 
        component: Users 
      },{
        name: 'right', 
        path: 'rights', 
        component: Right
      },{
        name: 'roles', 
        path: 'roles', 
        component: Role
      },{
        name: 'goods', 
        path: '/goods', 
        component: GoodsList
      },{
        name: 'goodsadd', 
        path: '/goodsadd', 
        component: GoodsAdd
      },{
        name: 'params', 
        path: '/params', 
        component: CateParams
      },{
        name: 'categories', 
        path: '/categories', 
        component: GoodsCate
      },{
        name: 'orders', 
        path: '/orders', 
        component: Orders
      },{
        name: 'reports', 
        path: '/reports', 
        component: Reports
      }]
    }

  ]
})

// 在路由配置生效之前，统一判断token
router.beforeEach((to,from,next) => {
  // 如果要去的是登陆 -> next()
  if(to.path==='/login'){
    next();
  } else {
    // 如果要去的不是登陆
    //  判断token
    //  获取token
    const token = sessionStorage.getItem('token');
    if (!token){
      // token没有 -> 转到登陆页面
      // this.$router.push({name:"login"});
      // 提示
      Message.warning('回到登录页');
      router.push({
        name:'login'
      })
      return;
    }
    // if token有 -> 继续渲染组件  next()
    next();
  }
})

export default router;