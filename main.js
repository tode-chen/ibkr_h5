import Vue from 'vue'
import App from './App'
import '@/common/js/global'
import '@/common/js/global_fn'
import '@/common/css/com.scss'
import '@/common/css/project.scss'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
