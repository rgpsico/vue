require('./bootstrap')
require('./plugins/index')
import Vue from 'vue'
import BaseTemplate from './layouts/DefaultTemplate'
import router from './routes'
import store from './store'
import { BootstrapVue } from 'bootstrap-vue'

Vue.config.productionTip = false

// Registrar componentes globais
Vue.component('preloader-component', () => import('./components/PreLoader'))

Vue.use(BootstrapVue)

// 🚀 Redirecionamento baseado no domínio/path
const host = window.location.hostname; // exemplo: delivery.comunidadeppg.com.br
const path = window.location.pathname; // exemplo: /, /loja/favi-hamburgues

// Exemplo 1: redireciona para loja padrão se estiver na home principal
if (host === 'delivery.comunidadeppg.com.br' && path === '/') {
  const lojaSlug = 'favi-hamburgues'; // você pode buscar da API futuramente
  window.location.replace(`/loja/${lojaSlug}`);
}

new Vue({
  render: h => h(BaseTemplate),
  router,
  store,
  created() {
    store.dispatch('getMe')
  }
}).$mount('#app')
