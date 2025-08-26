<template>
  <div class="products-container">
    <!-- Company Header -->
    <div class="company-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8 col-md-7">
            <div class="company-info">
              <h1 class="company-name">{{ company.name }}</h1>
              <p class="company-description" v-if="company.description">
                {{ company.description }}
              </p>
              <div class="company-details">
                <div class="detail-item" v-if="company.rating">
                  <i class="fas fa-star text-warning"></i>
                  <span>{{ company.rating }} • Avaliações</span>
                </div>
                <div class="detail-item" v-if="company.delivery_time">
                  <i class="fas fa-clock text-info"></i>
                  <span>{{ company.delivery_time }}</span>
                </div>
                <div class="detail-item" v-if="company.delivery_price">
                  <i class="fas fa-motorcycle text-success"></i>
                  <span>Entrega R$ {{ company.delivery_price }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-5 text-end">
            <div class="company-actions">
              <button
                class="btn btn-whatsapp btn-lg"
                @click="openWhatsApp"
                v-if="company.whatsapp"
              >
                <i class="fab fa-whatsapp me-2"></i>
                Falar no WhatsApp
              </button>
              <div class="company-status">
                <span class="status-indicator online"></span>
                <span class="status-text">Aberto agora</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Categories Filter -->
      <div class="categories-section">
        <h3 class="section-title">
          <i class="fas fa-list me-2"></i>
          Categorias
        </h3>
        <div class="categories-scroll">
          <div class="categories-container">
            <button
              :class="['category-btn', categoryInFilter('')]"
              @click="filterByCategory('')"
            >
              <div class="category-icon">
                <i class="fas fa-th-large"></i>
              </div>
              <span>Todas</span>
            </button>

            <button
              v-for="(category, index) in categories.data"
              :key="index"
              @click="filterByCategory(category.identify)"
              :class="['category-btn', categoryInFilter(category)]"
            >
              <div class="category-icon">
                <i class="fas fa-utensils"></i>
              </div>
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="products-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-utensils me-2"></i>
            Produtos
          </h3>
          <div class="products-count" v-if="company.products.data.length > 0">
            {{ company.products.data.length }}
            {{ company.products.data.length === 1 ? "produto" : "produtos" }}
          </div>
        </div>

        <!-- Loading State -->
        <div class="text-center py-5" v-if="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando produtos...</span>
          </div>
          <p class="mt-3 text-muted">Carregando Produtos...</p>
        </div>

        <!-- Empty State -->
        <div
          class="empty-state text-center py-5"
          v-else-if="company.products.data.length === 0"
        >
          <div class="empty-icon">
            <i class="fas fa-utensils"></i>
          </div>
          <h4 class="mt-3">Nenhum produto encontrado</h4>
          <p class="text-muted">
            {{
              filters.category
                ? "Tente selecionar outra categoria"
                : "Este restaurante ainda não possui produtos cadastrados"
            }}
          </p>
          <button
            class="btn btn-outline-primary"
            @click="filterByCategory('')"
            v-if="filters.category"
          >
            Ver todos os produtos
          </button>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" v-else>
          <div
            class="product-card-wrapper"
            v-for="(product, index) in company.products.data"
            :key="index"
          >
            <div
              class="product-card"
              :class="{ 'in-cart': productInCart(product) }"
            >
              <div class="product-image-container">
                <img
                  class="product-image"
                  :src="product.image || '/default-food.png'"
                  :alt="product.title"
                />

                <div class="product-badge" v-if="productInCart(product)">
                  <i class="fas fa-check"></i>
                </div>
              </div>

              <div class="product-content">
                <h4 class="product-title">{{ product.title }}</h4>
                <p class="product-description" v-if="product.description">
                  {{ product.description }}
                </p>
                <div class="product-price">
                  R$ {{ formatPrice(product.price) }}
                </div>
              </div>

              <div class="product-actions">
                <button
                  class="btn-add-cart"
                  @click="addProdCart(product)"
                  :disabled="false"
                >
                  <i
                    class="fas"
                    :class="
                      productInCart(product) ? 'fa-check' : 'fa-cart-plus'
                    "
                  ></i>
                  <span>
                    {{ productInCart(product) ? "Adicionado" : "Adicionar" }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- WhatsApp Floating Button -->
    <div class="whatsapp-float" v-if="company.whatsapp" @click="openWhatsApp">
      <i class="fab fa-whatsapp"></i>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  props: ["companyFlag"],

  data() {
    return {
      filters: {
        category: "",
      },
      loading: false,
    };
  },

  created() {
    this.initializeComponent();
  },

  computed: {
    ...mapState({
      company: (state) => state.companies.companySelected,
      categories: (state) => state.companies.categoriesCompanySelected,
      productsCart: (state) => state.cart.products,
    }),
  },

  methods: {
    ...mapActions(["getCategoriesByCompany", "getProductsByCompany"]),
    ...mapMutations({
      addProdCart: "ADD_PRODUCT_CART",
      removeProdCart: "REMOVE_PRODUCT_CART",
      removeTableCompany: "REMOVE_TABLE_COMPANY",
      removeCompany: "REMOVE_COMPANY_SELECTED",
    }),

    async initializeComponent() {
      const slug = window.location.pathname.split("/").filter(Boolean).pop();

      if (this.company.name === "") {
        await this.buscarEmpresaPorSlug(slug);
      } else {
        await this.loadInitialData();
      }
    },

    async loadInitialData() {
      try {
        await this.getCategoriesByCompany(this.company.uuid);
        await this.loadProducts();
      } catch (error) {
        this.$vToastify.error("Falha ao carregar dados", "Erro");
      }
    },

    async buscarEmpresaPorSlug(slug) {
      try {
        this.loading = true;
        const response = await fetch(
          `https://admindelivery.comunidadeppg.com.br/api/empresa/${slug}/uuid`
        );
        const data = await response.json();

        if (response.ok) {
          this.company.uuid = data.uuid;
          await this.loadInitialData();
        } else {
          this.$vToastify.error(
            data.message || "Erro ao buscar empresa",
            "Erro"
          );
          this.$router.push({ name: "home" });
        }
      } catch (error) {
        this.$vToastify.error("Erro na requisição", "Erro");
        this.$router.push({ name: "home" });
      } finally {
        this.loading = false;
      }
    },

    async loadProducts() {
      try {
        this.loading = true;
        const params = {
          token_company: this.company.uuid,
        };

        if (this.filters.category) {
          params.categories = [this.filters.category];
        }

        await this.getProductsByCompany(params);
      } catch (error) {
        this.$vToastify.error("Falha ao carregar produtos", "Erro");
      } finally {
        this.loading = false;
      }
    },

    filterByCategory(identify) {
      this.filters.category = identify;
      this.loadProducts();
    },

    categoryInFilter(identify) {
      return identify === this.filters.category ? "active" : "";
    },

    productInCart(product) {
      return this.productsCart.some(
        (prodCart) => prodCart.identify === product.identify
      );
    },

    addProdCart(product) {
      if (this.productInCart(product)) {
        this.removeProdCart(product.identify);
      } else {
        this.$store.commit("ADD_PRODUCT_CART", product);
      }
    },

    formatPrice(price) {
      return parseFloat(price).toFixed(2).replace(".", ",");
    },

    handleImageError(event) {
      return false;
      event.target.src = "/default-food.png";
    },

    openWhatsApp() {
      const phone = this.company.whatsapp || this.company.phone;
      const message = `Olá! Gostaria de fazer um pedido no ${this.company.name}`;
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    },
  },
};
</script>

<style scoped>
.products-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 80px;
}

.company-header {
  background: white;
  padding: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.company-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.company-description {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.company-details {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.company-actions {
  text-align: right;
}

.btn-whatsapp {
  background: #25d366;
  border: none;
  color: white;
  border-radius: 50px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.btn-whatsapp:hover {
  background: #128c7e;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
}

.company-status {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #28a745;
  display: inline-block;
}

.status-text {
  font-size: 0.9rem;
  color: #28a745;
  font-weight: 600;
}

.categories-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.categories-scroll {
  overflow-x: auto;
  padding-bottom: 1rem;
}

.categories-container {
  display: flex;
  gap: 1rem;
  min-width: max-content;
  padding: 0.5rem 0;
}

.category-btn {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 100px;
}

.category-btn:hover {
  border-color: #dc3545;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.2);
}

.category-btn.active {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.category-btn.active .category-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.products-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.products-count {
  background: #e9ecef;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #6c757d;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.product-card.in-cart {
  border: 2px solid #28a745;
}

.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #28a745;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.product-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #dc3545;
}

.product-actions {
  padding: 0 1.5rem 1.5rem;
}

.btn-add-cart {
  width: 100%;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-add-cart:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
}

.btn-add-cart:disabled {
  background: #28a745;
  cursor: not-allowed;
}

.empty-state {
  padding: 3rem;
}

.empty-icon {
  font-size: 4rem;
  color: #dee2e6;
}

.whatsapp-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(37, 211, 102, 0.6);
}

@media (max-width: 768px) {
  .products-container {
    padding-top: 70px;
  }

  .company-header {
    padding: 1.5rem 0;
  }

  .company-name {
    font-size: 2rem;
  }

  .company-details {
    flex-direction: column;
    gap: 0.5rem;
  }

  .company-actions {
    text-align: center;
    margin-top: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .categories-container {
    padding: 0.5rem 1rem;
  }

  .whatsapp-float {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
}
</style>
