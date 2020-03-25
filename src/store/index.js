import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 1.安装插件
Vue.use(Vuex)

// 2.创建Store对象
const state = {
    cartList: []
}
const store = new Vuex.Store({
        state,
        // mutations唯一的目的就是修改state中状态
        // mutations中的每个方法尽可能完成的事件比较单一一点
        mutations,
        // 异步操作和一些比较复杂的逻辑放到actions
        actions,
        getters
    })
    // 3.挂载到Vue实例上
export default store