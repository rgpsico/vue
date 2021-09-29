require('./bootstrap')
require('./plugins/index')
import Vue from 'vue'
import BaseTemplate from './layouts/DefaultTemplate'
import router from './routes'
import store from './store'

Vue.config.productionTip = false

/**
 *  Globals Components
 */

Vue.component('preloader-component',()=>import('./components/PreLoader'))

new Vue({
  render:  h => h(BaseTemplate),
  router,
  store
}).$mount('#app')
