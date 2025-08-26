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
            Cardápio
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
          <p class="mt-3 text-muted">Carregando cardápio...</p>
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
                <div class="product-stock" v-if="product.stock !== null">
                  Estoque: {{ product.stock }}
                </div>
              </div>
              <div class="product-actions">
                <button
                  class="btn-add-cart"
                  @click="addProdCart(product)"
                  :disabled="product.stock <= 0"
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

    <!-- Floating Cart Button with Tooltip -->
    <component
      v-if="productsCart.length > 0"
      :is="isAuthenticated ? 'router-link' : 'div'"
      v-bind="isAuthenticated ? { to: { name: 'cart' } } : {}"
      class="cart-float"
      :class="{ 'not-authenticated': !isAuthenticated }"
      @click="!isAuthenticated && handleCartClick()"
      aria-label="Ir para o carrinho"
    >
      <i class="fas fa-shopping-cart"></i>
      <span class="cart-count">{{ cartItemCount }}</span>
      <div class="cart-tooltip" v-if="showCartTooltip">
        <span>{{
          isAuthenticated
            ? "Clique aqui para ver o carrinho e ajustar quantidades!"
            : "Clique no carrinho para ajustar quantidades!"
        }}</span>
        <span
          class="tooltip-close"
          @click.prevent.stop="showCartTooltip = false"
          >×</span
        >
      </div>
    </component>

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
      showCartTooltip: false,
    };
  },
  computed: {
    ...mapState({
      company: (state) => state.companies.companySelected,
      categories: (state) => state.companies.categoriesCompanySelected,
      productsCart: (state) => state.cart.products,
      isAuthenticated: (state) => state.auth.isAuthenticated,
    }),
    cartItemCount() {
      return this.productsCart.reduce(
        (total, product) => total + (product.qty || 1),
        0
      );
    },
  },
  watch: {
    productsCart: {
      handler(newCart) {
        if (newCart.length > 0) {
          this.showCartTooltip = true;
          setTimeout(() => {
            this.showCartTooltip = false;
          }, 5000); // Hide tooltip after 5 seconds
        }
      },
      deep: true,
    },
  },
  created() {
    this.initializeComponent();
  },
  // Adicione este método no seu objeto methods existente
  methods: {
    ...mapActions(["getCategoriesByCompany", "getProductsByCompany"]),
    ...mapMutations({
      addProdCart: "ADD_PRODUCT_CART",
      removeProdCart: "REMOVE_PRODUCT_CART",
      removeTableCompany: "REMOVE_TABLE_COMPANY",
      removeCompany: "REMOVE_COMPANY_SELECTED",
    }),

    // Método para lidar com clique no carrinho quando não autenticado
    handleCartClick() {
      const token = localStorage.getItem("token_sanctum");

      if (!token) {
        this.$router.push({
          name: "login",
          query: { redirect: this.$route.fullPath },
        });
        return; // evita continuar a execução
      }

      // Se estiver autenticado, o router-link ou outra lógica segue normalmente
    },

    // Remova ou modifique o método goToCart existente (não é mais necessário)
    // goToCart() { ... } <- pode remover este método

    // ... resto dos seus métodos existentes permanecem iguais
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
        this.$store.commit("ADD_PRODUCT_CART", { ...product, qty: 1 });
      }
    },

    formatPrice(price) {
      return parseFloat(price).toFixed(2).replace(".", ",");
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
  handleCartClick() {
    if (this.isAuthenticated) {
      // Se estiver autenticado, navegar para o carrinho
      this.$router.push({ name: "cart" });
    } else {
      // Se não estiver autenticado, mostrar modal/tooltip de login
      this.showLoginPrompt();
      // ou redirecionar para login
      // this.$router.push({ name: 'login' });
    }
  },

  // Método original goToCart (pode ser removido se usar router-link)
  goToCart() {
    if (this.isAuthenticated) {
      this.$router.push({ name: "cart" });
    } else {
      this.showLoginPrompt();
    }
  },

  // Método para mostrar prompt de login
  showLoginPrompt() {
    // Implementar sua lógica de login aqui
    // Exemplo: mostrar modal, tooltip, ou redirecionar
    this.showCartTooltip = true;

    // Opcional: redirecionar para login após um delay
    setTimeout(() => {
      this.$router.push({ name: "login" });
    }, 2000);
  },
};
</script>

<style scoped>
/* Carrinho Flutuante */
.cart-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  border: 3px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.cart-float:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4),
    0 8px 20px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.cart-float:active {
  transform: translateY(-1px) scale(1.02);
}

/* Ícone do Carrinho */
.cart-float .fas.fa-shopping-cart {
  font-size: 22px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Contador de Itens */
.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
  animation: pulse-count 2s infinite;
}

@keyframes pulse-count {
  0%,
  70%,
  100% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.1);
  }
}

/* Tooltip Informativo */
.cart-tooltip {
  position: absolute;
  bottom: 70px;
  right: 0;
  background: rgba(26, 32, 44, 0.95);
  color: white;
  padding: 15px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  max-width: 280px;
  white-space: normal;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: tooltip-appear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom right;
}

.cart-tooltip::before {
  content: "";
  position: absolute;
  top: 100%;
  right: 20px;
  border: 8px solid transparent;
  border-top-color: rgba(26, 32, 44, 0.95);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

@keyframes tooltip-appear {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Botão de Fechar Tooltip */
.tooltip-close {
  position: absolute;
  top: 8px;
  right: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.tooltip-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: scale(1.1);
}

/* Responsivo para Mobile */
@media (max-width: 768px) {
  .cart-float {
    bottom: 20px;
    right: 20px;
    width: 55px;
    height: 55px;
  }

  .cart-float .fas.fa-shopping-cart {
    font-size: 20px;
  }

  .cart-count {
    width: 22px;
    height: 22px;
    font-size: 11px;
    top: -3px;
    right: -3px;
  }

  .cart-tooltip {
    bottom: 65px;
    right: -10px;
    max-width: 250px;
    font-size: 12px;
    padding: 12px 15px;
  }

  .cart-tooltip::before {
    right: 25px;
    border-width: 6px;
  }
}

/* Estados adicionais para melhor UX */
.cart-float.cart-empty {
  opacity: 0.7;
  cursor: not-allowed;
}

.cart-float.cart-updating {
  animation: cart-updating 1s infinite;
}

@keyframes cart-updating {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Efeito para quando o usuário não está logado */
.cart-float.not-authenticated {
  background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
}

.cart-float.not-authenticated:hover {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
}
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
