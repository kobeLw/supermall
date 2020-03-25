import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

// 默认导入toast里的index.js
import toast from 'components/common/toast'

Vue.config.productionTip = false
    // 添加事件总线对象
Vue.prototype.$bus = new Vue()
    // 安装toast插件 main.js一启动，就把插件安装好
    // 一旦调用Vue.use(),就会调用对象toast的install 对象toast就是obj
Vue.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

// 使用图片懒加载插件
Vue.use(VueLazyLoad, {
    loading: require('./assets/img/common/placeholder.png')
})

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')