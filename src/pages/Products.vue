<template>
  <div>
    <h1 class="my-4 title-tenant text-center">{{ company.name }}</h1>

    <div class="row">
      <div class="list-categories ">
        <a
          href="#"
          :class="['list-categories__item ', categoryInFilter('')]"
          @click.prevent="filterByCategory('')"
        >
          <div class="icon">
            <i class="fas fa-pizza-slice"></i>
          </div>
          <span> Todas </span>
        </a>

        <a
          href="#"
          @click.prevent="filterByCategory(category.identify)"
          v-for="(category, index) in categories.data"
          :key="index"
          :class="['list-categories__item ', categoryInFilter(category)]"
        >
          <div class="icon">
            <i class="fas fa-pizza-slice"></i>
          </div>
          <span> {{ category.name }} </span>
        </a>
      </div>
    </div>

    <div class="row my-4">
      <div v-if="company.products.data.length === 0">
        nenhum produto encontrado
      </div>
    </div>

    <div class="row my-4">
      <div
        class="col-lg-4 col-md-6 mb-4"
        v-for="(product, index) in company.products.data"
        :key="index"
      >
        <div
          :class="['card-flat', 'h-100', { disabled: productInCart(product) }]"
        >
          <a href="#">
            <div class="card-image">
              <img class="card-img-top" :src="product.image" alt="" />
            </div>
          </a>
          <div class="card-body">
            <h4 class="card-title">
              <a href="#">{{ product.title }} </a>
            </h4>
            <h5>R$ {{ product.price }}</h5>
            <p class="card-text">{{ product.description }}</p>
          </div>
          <div class="card-footer card-footer-custom">
            <a href="#" @click.prevent="addProdCart(product)"
              >Adicionar no Carrinho <i class="fas fa-cart-plus"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /.row -->
</template>

<script>
const host = window.location.hostname; // exemplo: delivery.comunidadeppg.com.br
const path = window.location.pathname; // exemplo: /, /loja/favi-hamburgues

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  props: ["companyFlag"],

  created() {
    if (this.company.name === "") {
      return this.$router.push({ name: "home" });
    }

    this.getCategoriesByCompany(this.company.uuid).catch((response) =>
      this.$vToastify.error("Falha ao carregar categorias", "Erro")
    );

    this.loadProducts();
  },

  computed: {
    ...mapState({
      company: (state) => state.companies.companySelected,
      categories: (state) => state.companies.categoriesCompanySelected,
      productsCart: (state) => state.cart.products,
    }),
  },

  data() {
    return {
      filters: {
        category: "",
      },
    };
  },

  methods: {
    ...mapActions(["getCategoriesByCompany", "getProductsByCompany"]),

    ...mapMutations({
      addProdCart: "ADD_PRODUCT_CART",
      removeTableCompany: "REMOVE_TABLE_COMPANY",
      removeCompany: "REMOVE_COMPANY_SELECTED",
    }),

    loadProducts() {
      const params = {
        token_company: this.company.uuid,
      };

      if (this.filters.category) {
        params.categories = [this.filters.category];
      }

      this.getProductsByCompany(params).catch((response) =>
        this.$vToastify.error("falha ao carregar os produtos", "Erro")
      );
    },

    filterByCategory(identify) {
      this.filters.category = identify;
      this.loadProducts();
    },

    categoryInFilter(identify) {
      return identify === this.filters.category ? "active" : "";
    },

    productInCart(product) {
      let inCart = false;
      this.productsCart.map((prodCart, index) => {
        if (prodCart.identify === product.identify) {
          inCart = true;
        }
      });

      return inCart;
    },
  },
};
</script>
