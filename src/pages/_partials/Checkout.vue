<template>
    <div>
      <div class="cart-price text-red">
              Preço Total: <b>R$ {{totalCart}}</b>
          </div>
          <div class="my-4">
          <a  href="#" class="cart-finalizar" @click.prevent="openModalCheckout">Finalizar</a>
          </div>
          <modal name="checkout">
              <div class="px-md-5 my-4" v-if="loading" >
                  <p>Gerando pedido ...(Aguarde)</p>


              </div>

              <div class="modal-container"  v-else>
              <div class="px-md-5 my-4" >
                  <div class="col-12" v-if="me.name !== '' ">
                      <p><strong>Total de produtos: {{products.length}}</strong></p>
                           <p><strong>Preço total: {{totalCart}}</strong></p>
                           <div class="form-group">
                               <textarea name="comment" v-model="comment" id="" cols="30" rows="2" placeholder="Comentario"></textarea>
                           </div>
                           <button class="btn btn-success" @click.prevent="createOrder">Fazer Pedidos</button>

                  </div>

                  <div v-else class="row">
                      <div class="col-12">
                            <p><strong>Total de produtos: {{products.length}}</strong></p>
                           <p><strong>Preço total: {{totalCart}}</strong></p>
                           <div class="form-group">
                               <textarea name="comment" v-model="comment" id="" cols="30" rows="2" class="form-control" placeholder="Comentario">

                               </textarea>
                           </div>
                           <button class="btn btn-success btn-full"  @click.prevent="createOrder">Fazer Pedidos de forma anônima</button>
                          
                      </div>
                        <div class="col-6">
                            <router-link  :to="{name: 'login'}" class="btn btn-dark btn-full login">
                                    fazer login
                            </router-link>
                        </div>
                  </div>
            </div>
              </div>
          </modal>
    </div>
</template>

<script>
import {mapState , mapActions} from 'vuex'
export default {

     computed: {
        ...mapState({
          products: state => state.cart.products,
          me: state => state.auth.me,
          company:state => state.companies.companySelected
      }),

      totalCart() {
        let total = 0; 

        this.products.map((itemCart , index) => {
          total += (itemCart.qty * itemCart.product.price)
        });
        return total;
      },

    
  },

  data() {
      return {
          comment: '',
          loading: false
      }
  },

  methods:{
      ...mapActions([
          'createOrder',
          'createOrderAutheticated'

      ]),

      createOrder () {
          this.loading = true
          const action = this.me.name === '' ? 'createOrder' : 'createOrderAutheticated'

          let params = {
            token_company: this.company.uuid ,
            comment: this.comment,
            products:[
                ...this.products

            ]

          }
          this.$store.dispatch(action , params)  
            .then(order => {
             this.$vToastify.success('Pedido realizado com sucesso','Parabéns')

             this.$router.push({
                 name:'order.detail',
                 params: {
                     identify: order.identify
                 }
                })
            })
            .catch(error => {
                    this.$vToastify.success('Pedido não pode ser','Error')
            })
            .finally(()=>  this.loading = false)
      }, 
      openModalCheckout () {
          this.$modal.show('checkout')
      },

        closeModalCheckout () {
          this.$modal.hide('checkout')
      },
  },

  

    
}
</script>
<style scoped>

@media screen and (min-width: 300px) {
  body {
    background-color: lightgreen;
  }
  .modal-container{width:50%; width:40%; margin-left: 220px;}
  .login{width:100%; text-transform: capitalize; margin-top:10px;}
}

@media screen and (min-width: 512px) { 
  .modal-container{width:70%; margin-left: 50px; }
}

@media screen and (min-width: 800px) {
  .modal-container{width:100%; padding:20px; margin-left:0;}
}




</style>