import Home from '@/pages/Home'
import Products from '@/pages/Products'
import Cart from '@/pages/Cart'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import SignupTenant from '@/pages/Auth/SignupTenant'
import MyOrders from '@/pages/Auth/MyOrders'
import DetailOrder from '@/pages/DetailOrder'
import PageNotFound from '@/pages/PageNotFound'
import Profile from '@/pages/Profile'
import BarracaDigital from '@/pages/BarracaDigital'
import axios from 'axios'
import { API_VERSION } from '@/configs/api'

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/DefaultTemplate'),
        children:[
            {
                path: '/pedido/:identify',
                component: DetailOrder,
                name: 'order.detail',
                props: true

            },
             {
                path: '/perfil',
                component: Profile,
                name: 'profile'
            },
            {
                path: '/meus-pedidos',
                component: MyOrders,
                name: 'my.orders'
            },
            {
                path: '/carrinho',
                component: Cart,
                name: 'cart'
            },
            {
                path: '/loja/:companyFlag',
                component: Products,
                name: 'products',
                props: true
            },

            // Deep link do QR Code de cada guarda-sol/cadeira (gerado no
            // admin): escanear leva direto pro cardapio da loja com o
            // guarda-sol ja selecionado, sem precisar escolher na lista.
            {
                path: '/:tenantUuid([0-9a-fA-F-]{36})/:tableUuid([0-9a-fA-F-]{36})',
                component: Products,
                name: 'products.table',
                props: true
            },

            {
                path: '/',
                component: Home,
                name: 'home'
            }
        ]
    },

    {
        path:'/auth',
        component: () => import('@/layouts/AuthTemplate'),
        children: [
            {
                path: '/entrar',
                component: Login,
                name: 'login'
            },
            {
                path: '/cadastrar',
                component: Register,
                name: 'register'
            },
            {
                path: '/cadastrar-barraca',
                component: SignupTenant,
                name: 'signup.tenant'
            }

        ]
    },
    {
        path: '/barraca-digital',
        component: BarracaDigital,
        name: 'barraca.digital'
    },
    {
        // Link curto da barraca: /barraca-do-rg abre /loja/barraca-do-rg.
        // Se nao for o endereco de nenhuma barraca ativa, cai na pagina 404.
        path: '/:companyFlag',
        component: PageNotFound,
        meta: { title: 'Página não encontrada' },
        beforeEnter: (to, from, next) => {
            axios.get(`${API_VERSION}/tenants`, { params: { per_page: 200 } })
                .then(res => {
                    const found = (res.data.data || []).some(t => t.flag === to.params.companyFlag)
                    found ? next({ path: `/loja/${to.params.companyFlag}`, replace: true }) : next()
                })
                .catch(() => next())
        }
    },
    {
        path: '*',
        component: PageNotFound,
        meta:{
            title: 'Página não encontrada'
        }
    }
    
    
]


export default routes;