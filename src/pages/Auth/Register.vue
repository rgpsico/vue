<template>
    <div>
   <!-- login -->
    <div class="d-flex justify-content-center h-100 my-5">
      <div class="user_card">
        <div class="d-flex justify-content-center">
          <div class="brand_logo_container">
           <router-link :to="{name:'home'}">
                <img src="@/assets/imgs/vue-food.png" class="brand_logo" alt="Logo">
           </router-link>
          </div>
        </div>
        <div class="d-flex justify-content-center form_container">
          <form @submit.prevent="registerClient">
            <div class="text-danger" v-if="errors.name != '' ">
              {{errors.name[0] || '' }}

            </div>

            <div class="input-group">
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                </div>
                 
                <input type="text" 
                v-model="formData.name" 
                name="name" 
                :class="['form-control', 'input_user', {'is-invalid' : errors.name != '' }]" value="" 
                placeholder="Nome">
            </div>

    <div class="text-danger" v-if="errors.email != '' ">
              {{errors.email[0] || '' }}

             </div>
            <div class="input-group">
              
              <div class="input-group-append">
                
                <span class="input-group-text">
                  <i class="fas fa-envelope"></i></span>
               
              </div>
              
              <input 
              type="email" 
              v-model="formData.email" 
              name="email" 
              :class="['form-control', 'input_user', {'is-invalid' : errors.email != '' }]"
              value="" 
              placeholder="E-mail">
            </div>

            

            
           
           
            <div class="text-danger" v-if="errors.password != '' ">
              {{errors.password[0] || '' }}

             </div>
            <div class="input-group">
              <div class="input-group-append">
                <span class="input-group-text"><i class="fas fa-key"></i></span>
              </div>
              <input type="password" 
              v-model="formData.password" 
              name="password" 
               :class="['form-control', 'input_user', {'is-invalid' : errors.password != '' }]"        
              placeholder="Senha">
            </div>
              <div class="d-flex justify-content-center login_container">
          <button type="submit" name="button" 
          class="btn login_btn"
          :disabled="loading" 
          >
           <span v-if="loading">Cadastrando</span> 
            <span v-else>Cadastrar</span> 

          </button>
           </div>
          </form>
        </div>
    
        <div class="mt-4">
          <div class="d-flex justify-content-center links">
            Já tem conta?<i style="margin-right:5px;"></i>           

             <router-link :to="{name:'login'}" class="ml-2" >Login</router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- login-->
    </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default{
    data(){
      return {
        loading: false,
        formData: {
          name: '',
          email:'',
          password:''
        },
        errors: {
          name:'',
          email:'',
          password: '',

        }
      }
    },
    methods: {
      ...mapActions([
        'register'
      ]),

      registerClient() {
        this.reset()
        this.loading =  true

        this.register(this.formData)
          .then(response => {
                   this.$vToastify.success('Cadastro realizado com successo','Parabéns')
                   this.$router.push({name:'login'})
          })
           .catch(error=>{
             const errorResponse = error.response 
           

             if ( errorResponse.status === 422 ) {
               this.errors = Object.assign(this.errors, errorResponse.data.errors)

               this.$vToastify.error('Dados inválidos , verifique novamente ','Erro')

                    setTimeout( () => this.reset() , 4000)
               return ; 
             }
              
              this.$vToastify.error('Falha ao Registrar','Erro')

         

           } )
           .finally(() => this.loading = false)  

      },
      reset() {
        this.errors = {
          name: '',
          email:'',
          password:''

        }

      }

    }

  }

</script>