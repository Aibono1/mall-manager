// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import MyBread from '@/components/cuscom/myBread.vue'
import MyHttpServer from '@/plugins/http.js'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/reset.css'
import router from './router'
import moment from 'moment'

// 使用vue插件
Vue.use(ElementUI);
Vue.use(MyHttpServer);

Vue.config.productionTip = false

// 全局过滤器 - 处理日期
Vue.filter('fmtdate',(v)=>{
  return moment(v).format('YYYY-MM-DD');
})

// 全局自定义组件
Vue.component(MyBread.name,MyBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
