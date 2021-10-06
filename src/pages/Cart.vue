<template>
    <div class="container container-body">

    <!-- cart -->
    <div class="card shopping-cart my-4 ">
        <div class="card-header text-light">
            <i class="fa fa-shopping-cart mr-2" aria-hidden="true"></i>
            Carrinho de Compras
           
            <router-link class="btn bnt-sm btn-comprando" :to="{name:'home'}">Continuar Comprando</router-link>
            <div class="clearfix"></div>
        </div>
        <div class="card-body">
          <!-- PRODUCT -->
          <div class="row align-items-center py-2" v-for="(item , index) in products" :key="index">
            <div class="col-4 text-center">
              <div class="img-circle">
                <img class="img-responsive" :src="item.product.image" :alt="item.product.title" width="120" height="80">
              </div>
            </div>
            <div class="col-8 text-left">
              <h4 class="product-name"><strong>{{item.product.title}}</strong></h4>
              <h5 class="h6">{{item.product.description}}</h5>
              <div class="d-flex py-4 justify-content-between align-items-center">
                <div class="col-10 d-flex align-items-center p-0 ">
                    <h6><strong>R$ {{item.product.price}} 
                      <span class="text-muted">x</span>
                      </strong>
                    </h6>

                     <div class="quantity ml-4">
                         <input type="button" value="+" class="plus" @click.prevent="incrementQty(item.product)">
                                <input type="number" step="1" max="99" min="1" :value="item.qty" title="Qty" class="qty">
                                <input type="button" value="-" class="minus" @click.prevent="decrementQty(item.product)">
                    </div>
                </div>
                <div class="col-2 col-sm-2 col-md-2 text-right">
                            <button type="button" 
                            class="btn btn-outline-danger btn-xs"
                            @click.prevent="removeCart(item.product)">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
              </div>
             </div>
          </div>
        </div> 
     
          <!-- END PRODUCT -->
          <hr>
         
         <checkout/>
        </div>
        <!-- end card body -->
        
    </div>
    <!-- cart-->

 
</template>
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css');
</style>
<script>
import {mapState , mapMutations} from 'vuex'
import Checkout from './_partials/Checkout.vue'

export default {
    computed: {
        ...mapState({
          products: state => state.cart.products
      }),

    
  },

  methods: {
    ...mapMutations({
       removeCart: 'REMOVE_PROD_CART',
      incrementQty: 'INCREMENT_QTY_PROD_CART',
      decrementQty: 'DECREMENT_QTY_PROD_CART',
    }),
  },

  components: {
    Checkout
  }
}
</script>