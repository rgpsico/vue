<template>
<div>
 <h1 class="my-4 title-tenant text-center">{{company.name}}</h1>
   
    <div class="row">      
        <div class="list-categories">
          <a href="#"
          @click.prevent="filterByCategory(category)" 
          class="list-categories__item active" 
          v-for="(category , index) in categories.data" 
          :key="index"
          >
            <div class="icon">
              <i class="fas fa-pizza-slice"></i>
            </div> 
            <span> {{category.name}} </span>
          </a>
        </div>
    </div>



     <div class="row my-4" >
      <div class="col-lg-4 col-md-6 mb-4"
     v-for="(product, index) in company.products.data" :key="index"
 >
        <div class="card--flat h-100">
          <a href="#">
            <div class="card-image">
              <img class="card-img-top" :src="product.image" alt="">
            </div>
          </a>
          <div class="card-body">
            <h4 class="card-title">
              <a href="#">{{product.title}}</a>
            </h4>
            <h5>R$ {{product.price}}</h5>
            <p class="card-text">{{product.price}}</p>
          </div>
          <div class="card-footer card-footer-custom">
            <a href="#">Adicionar no Carrinho <i class="fas fa-cart-plus"></i></a>
          </div>
        </div>
      </div>

     
     
    </div>
  
    </div>
    <!-- /.row -->
</template>

<script>
import {mapState , mapActions} from 'vuex'
export default {
  props:['companyFlag'],
  created() {   
    if (this.company.name == '')  {
        return this.$router.push({name:'home'})
    }

     this.getCategoriesByCompany(this.company.uuid)
    .catch(response => this.$vToastify.error("Falha ao carregar categorias","Erro"))
    
  
   //  this.getProductsByCompany(this.company.uuid)
    //.catch(response => this.$vToastify.error("Falha ao carregar produtos","Erro"))
    
  },
  computed: {
    ...mapState({
      company: state => state.companies.companySelected,
      categories: state => state.companies.categoriesCompanySelected,
    

    }),
  },

data() {
  return {
    filters: {
      category: ''
    }
  }
},


  methods: {
    ...mapActions([
      'getCategoriesByCompany',
      'getProductsByCompany'
    ]),
    
    loadProducts () {
      const params = {
        token_company: this.company.uuid,
      }

      if (this.filters.category) {
        params.categories = [
          this.filters.category
        ]
      } 

      this.getProductsByCompany(this.company.uuid)
      .catch(response=> this.$vToastify.error('falha ao carregar os produtos','Erro'))     
  },

    filterByCategory(category) {
    this.filters.category = category.identify
    this.loadProducts()
  }

 }
 
}
</script>