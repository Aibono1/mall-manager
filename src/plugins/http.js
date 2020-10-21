// 插件模块

import axios from 'axios'


const MyHttpServer = {}

MyHttpServer.install = (Vue) => {

    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

    // 在请求发起之前，会先来到下面的回调函数
    // 添加请求拦截器
    axios.interceptors.request.use(function (config) {
        if (config.url !== 'login') {
            const AUTH_TOKEN = sessionStorage.getItem('token');
            config.headers['Authorization'] = AUTH_TOKEN;
        }
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        return response;
    }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });

    // 4. 添加实例方法
    Vue.prototype.$http = axios
}

export default MyHttpServer