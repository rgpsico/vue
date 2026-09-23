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
            },
            {

                path:'/:pathMatch(.*)', 
                component: Home,
                name:'home' 
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
        path: '*',
        component: PageNotFound,
        meta:{
            title: 'Página não encontrada'
        }
    }
    
    
]


export default routes;