import Vue from 'vue'
import App from './App.vue'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store/index.js'
// eslint-disable-next-line no-unused-vars
// import vconsole from 'vconsole'
Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(VueLazyLoad,{
  preLoad: 1.3,
  loading: require('@/common/images/default.png'),
  attempt: 1
})
// 导入样式
import '@/common/less/index.less'
import '@/common/fonts/all/iconfont.css'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
