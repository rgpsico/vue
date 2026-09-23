import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes.map'



Vue.use(VueRouter)



const router = new VueRouter({
    mode: 'history',
    routes,
    // Sem isso o SPA mantem a posicao de scroll da pagina anterior ao
    // navegar (ex: ir da loja rolada pro carrinho abre no meio da tela)
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { x: 0, y: 0 }
    }
})

export default router