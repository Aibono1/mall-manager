// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
// 引入全局样式
import './assets/css/global.css'
// 引入表格树
import TreeTable from 'vue-table-with-tree-grid'
// 引入面包屑组件
import MyBread from '@/components/cuscom/myBread.vue'
import MyHttpServer from '@/plugins/http.js'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import moment from 'moment'

// 使用vue插件
Vue.use(ElementUI);
Vue.use(MyHttpServer);

Vue.config.productionTip = false

// 全局过滤器 - 处理日期
Vue.filter('fmtDate',(v)=>{
  return moment(v).format('YYYY-MM-DD');
})

// 全局自定义组件
Vue.component(MyBread.name,MyBread)

// 全局注册表格树组件
Vue.component('tree-table', TreeTable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
