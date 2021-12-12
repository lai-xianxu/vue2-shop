import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 导入tree-table
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑框
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑框样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'
// 导入NProgress 对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入axios，并配置请求的根路径
import axios from 'axios' // for bubble theme
Vue.component('tree-table', TreeTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 响应拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  // 为请求对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
// 全局时间过滤器
Vue.filter('dataFormat', function(data) {
  const date = new Date(data)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + 1 + '').padStart(2, '0')
  const hh = (date.getHours() + 1 + '').padStart(2, '0')
  const mm = (date.getMinutes() + 1 + '').padStart(2, '0')
  const ss = (date.getSeconds() + 1 + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
