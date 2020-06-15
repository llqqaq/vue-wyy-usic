import Vue from 'vue'
import VueX from 'vuex'

import state from './state'
import getters from './getter'
import mutations from './mutations'
import actions from './action'

Vue.use(VueX)

// 调试,判断是否在线上模式
// 开启严格模式,只能通过mutations修改state的值
const debug = process.env.NODE_ENV !== 'production'

// 创建仓库
const store = new VueX.Store({
    state,
    getters,
    mutations,
    actions,
    strict: debug
})


export default store