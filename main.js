import Vue from 'vue'
import App from './App'
import '@/common/js/global'
import '@/common/js/global_fn'
import '@/common/css/com.scss'
import '@/common/css/project.scss'
// #ifdef H5
// 提交前需要注释  本地调试使用
const vconsole = require('vconsole')
Vue.prototype.$vconsole = new vconsole() // 使用vconsole
// #endif
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()