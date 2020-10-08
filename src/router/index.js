import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Role from '@/components/rights/role.vue'
import {Message} from 'element-ui'


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
    const token = localStorage.getItem('token');
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