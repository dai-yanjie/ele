import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/assets/style/reset.css"
import '@/assets/style/style.css'
import components from '@/components'
import axios from 'axios'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI);
for( let key in components){
  Vue.component(key,components[key]);
}

Vue.config.productionTip = false
/*请求拦截*/
axios.interceptors.request.use((config)=>{
  config.url='/ele'+config.url+'?t='+Date.now()
  return config
})
/*响应拦截*/
axios.interceptors.response.use(({data})=>{
  return data
})
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
