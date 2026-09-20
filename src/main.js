require('./bootstrap')
require('./plugins/index')
import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import { BootstrapVue } from  'bootstrap-vue'
Vue.config.productionTip = false

/**
 *  Globals Components
 */

Vue.component('preloader-component',()=>import('./components/PreLoader'))
Vue.use(BootstrapVue)
new Vue({
  render:  h => h(App),
  router,
  store
}).$mount('#app')

store.dispatch('getMe')
