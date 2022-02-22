<template>
    <div>
        <preloader-component/>
       <header-component/>
            <!-- Page Content -->
            <div class="container container-body">
                <router-view></router-view>
                
            </div>

        <footer-component/>
    </div>
</template>

<script>

import 'bootstrap/dist/css/bootstrap.min.css'
import HeaderComponent from './_partials/header'
import FooterComponent from './_partials/footer'
import HomeComponent from '@/pages/Home'
import LoginComponent from '@/pages/Auth/Login'
import RegisterComponent from '@/pages/Auth/Register'
import PreLoader from '../components/PreLoader.vue'
export default {

    components:{
        HeaderComponent,
        HomeComponent,
        FooterComponent,
        LoginComponent,
        RegisterComponent,
        PreLoader


    }
    
}
</script>

<style scoped>
@import url('../assets/css/PPGFOOD.css');
@import url('../assets/css/reset.css');
</style>



