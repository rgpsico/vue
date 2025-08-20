import Home from '@/pages/Home'
import Products from '@/pages/Products'
import Cart from '@/pages/Cart'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
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