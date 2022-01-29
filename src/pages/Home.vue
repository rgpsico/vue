<template>
     <div class="row">

      <div class="col-lg-12">

        <h1 class="my-4 title-tenant">Restaurantessss</h1>

        <div class="row my-4">

          <div class="col-lg-2 col-md-2 col-4 mb-2" v-for="(company , index) in companies.data" :key="index">
        
            <div class="restaurant-card">
                <a href="#"  @click.prevent="goStoreCompany(company)">       
              <img 
              v-if="company.image"
              class="card-img-top"
              :src="company.image"
              :alt="company.name"
               :height="80"
               :width="80"
              
              >

                <img v-else
                  class="card-img-top"
                  src="@/assets/imgs/vue-food.png"
                  :alt="company.name"
                   :height="80"
               :width="80"
                  >
              </a>
                <div class="restaurant-card-body">
                <h3>
               <!-- <router-link 
                :to="{name:'products', 
                params:{companyFlag:company.flag}}">
                  {{company.name}}
                </router-link> -->

                <a href="#" @click.prevent="goStoreCompany(company)">
                    {{company.name}}

                </a>
                </h3>
              </div>
            </div>
          </div>

         
        </div>
        <!-- /.row -->

      </div>
      <!-- /.col-lg-9 -->

    </div>
    <!-- /.row -->
</template>

<script>
import {mapActions , mapState , mapMutations} from 'vuex'

export default {
  mounted() {
    this.getCompanies()
    .catch(response => this.$vToastify.error("Falha ao carregar empresas","Erro"))
    
},

  computed: {
 //   companies() {
   //   return this.$store.state.companies.items
  //  }
  ...mapState({
    companies: state => state.companies.items

  })

  },
  methods: {
    ...mapActions([
      'getCompanies'
      
    ]),

    ...mapMutations({
      setCompany: 'SET_COMPANY_SELECTED'


    }),

    goStoreCompany (company) {
    this.setCompany(company)

    this.$router.push({name:'products' , 
    params: {companyFlag:company.flag} 
    })

    }
  }
}
</script>