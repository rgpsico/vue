<template>
  <div class="store-page">
    <!-- Store Header -->
    <header class="store-header">
      <div
        class="store-cover"
        :class="{ 'has-photo': company.cover_image }"
        :style="
          company.cover_image
            ? { backgroundImage: 'url(' + company.cover_image + ')' }
            : {}
        "
      >
        <div class="store-avatar" v-if="company.image">
          <img :src="company.image" :alt="company.name" />
        </div>
      </div>
      <div class="container store-header-content">
        <div class="calcadao-pattern" :style="{ backgroundImage: 'url(' + calcadaoPattern + ')' }"></div>
        <h1 class="store-name">{{ company.name }}</h1>
        <div class="store-meta">
          <span class="store-location" v-if="company.location_label">
            <i class="fa-solid fa-location-dot"></i>
            {{ company.location_label }}
          </span>
          <span class="store-status">
            <span class="status-dot"></span>
            Aberto
          </span>
        </div>

        <div class="table-picker">
          <button
            class="table-picker-badge"
            @click="showTablePicker = !showTablePicker"
          >
            <i class="fa-solid fa-umbrella-beach"></i>
            <span v-if="selectedTable">{{ selectedTable.name }}</span>
            <span v-else>Selecionar guarda-sol / cadeira</span>
            <i class="fa-solid fa-chevron-down table-picker-caret"></i>
          </button>

          <div class="table-picker-dropdown" v-if="showTablePicker">
            <p v-if="tables.length === 0" class="table-picker-empty">
              Nenhum guarda-sol cadastrado nesta loja.
            </p>
            <button
              v-for="table in tables"
              :key="table.identify"
              class="table-picker-option"
              :class="{ active: selectedTable && selectedTable.identify === table.identify }"
              @click="chooseTable(table)"
            >
              {{ table.name }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Sticky search + categories -->
    <div class="store-toolbar">
      <div class="container">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar no cardápio..."
          />
        </div>

        <div class="category-tabs">
          <button
            :class="['category-chip', { active: filters.category === '' }]"
            @click="filterByCategory('')"
          >
            Todas
          </button>
          <button
            v-for="(category, index) in categories.data"
            :key="index"
            :class="[
              'category-chip',
              { active: filters.category === category.identify },
            ]"
            @click="filterByCategory(category.identify)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Loading State -->
      <div class="state-box" v-if="loading">
        <div class="spinner"></div>
        <p>Carregando cardápio...</p>
      </div>

      <!-- Empty State -->
      <div class="state-box" v-else-if="filteredProducts.length === 0">
        <i class="fa-solid fa-bowl-food state-icon"></i>
        <h3>Nenhum produto encontrado</h3>
        <p>
          {{
            search
              ? "Tente buscar por outro termo"
              : filters.category
              ? "Tente selecionar outra categoria"
              : "Esta loja ainda não possui produtos cadastrados"
          }}
        </p>
        <button
          class="btn-reset"
          @click="clearFilters"
          v-if="search || filters.category"
        >
          Limpar filtros
        </button>
      </div>

      <!-- Products List -->
      <ul class="product-list" v-else>
        <li
          class="product-item"
          v-for="(product, index) in filteredProducts"
          :key="index"
        >
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <p class="product-description" v-if="product.description">
              {{ product.description }}
            </p>
            <div class="product-footer">
              <span class="product-price">
                R$ {{ formatPrice(product.price) }}
              </span>
              <span
                class="low-stock-badge"
                v-if="isLowStock(product)"
              >
                Últimas {{ product.stock }} unid.
              </span>
            </div>
          </div>

          <div class="product-side">
            <div class="product-image-box">
              <img
                :src="product.image || placeholderImage"
                :alt="product.title"
              />
            </div>

            <button
              v-if="cartQty(product) === 0"
              class="btn-add"
              @click="addToCart(product)"
            >
              <i class="fa-solid fa-plus"></i>
              Adicionar
            </button>

            <div class="qty-stepper" v-else>
              <button class="qty-btn" @click="decrement(product)">
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="qty-value">{{ cartQty(product) }}</span>
              <button class="qty-btn" @click="increment(product)">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- WhatsApp Floating Button -->
    <a
      v-if="company.whatsapp"
      class="whatsapp-float"
      :class="{ 'above-cart-bar': cartItemCount > 0 }"
      @click.prevent="openWhatsApp"
      href="#"
      aria-label="Falar no WhatsApp"
    >
      <i class="fa-brands fa-whatsapp"></i>
    </a>

    <!-- Sticky Cart Bar -->
    <div class="cart-bar" v-if="cartItemCount > 0">
      <component
        :is="isAuthenticated ? 'router-link' : 'button'"
        v-bind="isAuthenticated ? { to: { name: 'cart' } } : {}"
        class="cart-bar-button"
        @click="!isAuthenticated && handleCartClick()"
      >
        <span class="cart-bar-count">{{ cartItemCount }}</span>
        <span class="cart-bar-label">Ver carrinho</span>
        <span class="cart-bar-total">R$ {{ formatPrice(cartTotal) }}</span>
      </component>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import axios from "axios";
import { API_VERSION } from "@/configs/api";
import calcadaoPattern from "@/assets/imgs/calcadao-pattern.webp";

export default {
  props: ["companyFlag", "tenantUuid", "tableUuid"],
  data() {
    return {
      filters: {
        category: "",
      },
      search: "",
      loading: false,
      placeholderImage:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23f1f2f4'/%3E%3C/svg%3E",
      calcadaoPattern,
      tables: [],
      showTablePicker: false,
    };
  },
  computed: {
    ...mapState({
      company: (state) => state.companies.companySelected,
      categories: (state) => state.companies.categoriesCompanySelected,
      productsCart: (state) => state.cart.products,
      isAuthenticated: (state) => state.auth.authenticated,
      selectedTable: (state) => state.companies.selectedTable,
    }),
    filteredProducts() {
      const products = this.company.products.data || [];
      if (!this.search.trim()) return products;

      const term = this.search.trim().toLowerCase();
      return products.filter((product) =>
        product.title.toLowerCase().includes(term)
      );
    },
    cartItemCount() {
      return this.productsCart.reduce(
        (total, product) => total + (product.qty || 1),
        0
      );
    },
    cartTotal() {
      return this.productsCart.reduce(
        (total, item) => total + item.qty * item.product.price,
        0
      );
    },
  },
  created() {
    this.initializeComponent();
  },
  methods: {
    ...mapActions([
      "getCategoriesByCompany",
      "getProductsByCompany",
      "getTablesByCompany",
    ]),
    ...mapMutations({
      addProdCart: "ADD_PRODUCT_CART",
      removeProdCart: "REMOVE_PRODUCT_CART",
      incrementProdCart: "INCREMENT_QTY_PROD_CART",
      decrementProdCart: "DECREMENT_QTY_PROD_CART",
      setCompany: "SET_COMPANY_SELECTED",
      setSelectedTable: "SET_SELECTED_TABLE",
    }),

    async loadTables() {
      if (!this.company.uuid) return;
      try {
        this.tables = await this.getTablesByCompany(this.company.uuid);
      } catch (error) {
        this.tables = [];
      }
    },

    chooseTable(table) {
      this.setSelectedTable(table);
      this.showTablePicker = false;
    },

    handleCartClick() {
      const token = localStorage.getItem("token_sanctum");
      if (!token) {
        this.$router.push({
          name: "login",
          query: { redirect: this.$route.fullPath },
        });
      } else {
        this.$router.push({ name: "cart" });
      }
    },

    async initializeComponent() {
      // Deep link do QR Code de um guarda-sol/cadeira especifico
      if (this.tenantUuid && this.tableUuid) {
        await this.loadFromTableDeepLink();
        return;
      }

      const slug = window.location.pathname.split("/").filter(Boolean).pop();
      if (this.company.name === "") {
        await this.buscarEmpresaPorSlug(slug);
      } else {
        await this.loadInitialData();
      }
    },

    async loadFromTableDeepLink() {
      try {
        this.loading = true;
        const tenantResponse = await axios.get(
          `${API_VERSION}/tenants/${this.tenantUuid}`
        );
        this.setCompany(tenantResponse.data.data);

        try {
          const tableResponse = await axios.get(
            `${API_VERSION}/tables/${this.tableUuid}`,
            { params: { token_company: this.tenantUuid } }
          );
          this.setSelectedTable(tableResponse.data.data);
        } catch (tableError) {
          // Guarda-sol invalido/removido - segue sem selecionar, cliente
          // pode escolher manualmente na tela
        }

        await this.loadInitialData();
      } catch (error) {
        this.$vToastify.error("Loja não encontrada", "Erro");
        this.$router.push({ name: "home" });
      } finally {
        this.loading = false;
      }
    },

    async loadInitialData() {
      try {
        await this.getCategoriesByCompany(this.company.uuid);
        await this.loadProducts();
        await this.loadTables();
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
          const tenantResponse = await axios.get(
            `${API_VERSION}/tenants/${data.uuid}`
          );
          this.setCompany(tenantResponse.data.data);
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

    clearFilters() {
      this.search = "";
      this.filterByCategory("");
    },

    cartQty(product) {
      const item = this.productsCart.find(
        (prodCart) => prodCart.identify === product.identify
      );
      return item ? item.qty : 0;
    },

    isLowStock(product) {
      return (
        typeof product.stock === "number" &&
        product.stock > 0 &&
        product.stock <= 5
      );
    },

    addToCart(product) {
      this.addProdCart({ ...product, qty: 1 });
    },

    increment(product) {
      this.incrementProdCart(product);
    },

    decrement(product) {
      this.decrementProdCart(product);
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
};
</script>

<style scoped>
.store-page {
  min-height: 100vh;
  background: #f7f7f8;
  padding-bottom: 2rem;
}

/* ── Header ────────────────────────────────────────────── */
.store-header {
  background: #fff;
  border-bottom: 1px solid #ececec;
}

.store-cover {
  position: relative;
  height: 240px;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  background-size: cover;
  background-position: center;
}

.store-cover.has-photo {
  background-color: #eee;
}

.store-avatar {
  position: absolute;
  left: 50%;
  bottom: -30px;
  transform: translateX(-50%);
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: #fff;
  border: 4px solid #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.store-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-header-content {
  position: relative;
  padding: 2.75rem 1rem 1rem;
  text-align: center;
}

.calcadao-pattern {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(45%, 320px);
  background-size: 140px;
  background-repeat: repeat;
  background-position: center;
  opacity: 0.5;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to left, #000 0%, transparent 100%);
  mask-image: linear-gradient(to left, #000 0%, transparent 100%);
}

.store-name {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
}

.store-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.6rem 1rem;
  font-size: 0.88rem;
  color: #6b7280;
}

.store-location {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.store-location i {
  color: #9ca3af;
}

.store-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #15803d;
  font-weight: 700;
  background: #dcfce7;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #15803d;
}

/* ── Table picker (guarda-sol / cadeira) ─────────────────── */
.table-picker {
  position: relative;
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
}

.table-picker-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff7ed;
  border: 1.5px solid #ff6b35;
  color: #c2410c;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.table-picker-badge:hover {
  background: #ffedd5;
}

.table-picker-caret {
  font-size: 0.65rem;
  color: #c2410c;
  opacity: 0.7;
}

.table-picker-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  min-width: 220px;
  max-height: 260px;
  overflow-y: auto;
  z-index: 60;
}

.table-picker-empty {
  padding: 0.75rem;
  margin: 0;
  color: #6b7280;
  font-size: 0.85rem;
  text-align: center;
}

.table-picker-option {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1a1a1a;
  cursor: pointer;
}

.table-picker-option:hover {
  background: #f2f3f5;
}

.table-picker-option.active {
  background: #fff7ed;
  color: #c2410c;
  font-weight: 700;
}

/* ── Toolbar (search + categories) ───────────────────────── */
.store-toolbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #ececec;
  padding: 0.85rem 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f2f3f5;
  border-radius: 12px;
  padding: 0.6rem 0.9rem;
  margin-bottom: 0.85rem;
}

.search-box i {
  color: #9ca3af;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-size: 0.95rem;
  color: #1a1a1a;
}

.category-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-chip {
  flex: none;
  background: #f2f3f5;
  border: none;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.category-chip:hover {
  background: #e5e7eb;
}

.category-chip.active {
  background: #ff6b35;
  color: #fff;
}

/* ── States ───────────────────────────────────────────────── */
.state-box {
  text-align: center;
  padding: 4rem 1rem;
  color: #6b7280;
}

.state-icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.state-box h3 {
  color: #1a1a1a;
  margin-bottom: 0.4rem;
}

.spinner {
  width: 34px;
  height: 34px;
  border: 3px solid #f2f3f5;
  border-top-color: #ff6b35;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-reset {
  margin-top: 1rem;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 999px;
  padding: 0.5rem 1.4rem;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
}

.btn-reset:hover {
  border-color: #ff6b35;
  color: #ff6b35;
}

/* ── Product list ─────────────────────────────────────────── */
.product-list {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #ececec;
}

.product-item {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  padding: 1.1rem 1.1rem;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.3rem;
}

.product-description {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 0.6rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.product-price {
  font-size: 1rem;
  font-weight: 800;
  color: #1a1a1a;
}

.low-stock-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: #b45309;
  background: #fef3c7;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
}

.product-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  flex: none;
}

.product-image-box {
  width: 92px;
  height: 92px;
  border-radius: 12px;
  overflow: hidden;
  background: #f2f3f5;
}

.product-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: #fff;
  border: 1.5px solid #ff6b35;
  color: #ff6b35;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-add:hover {
  background: #ff6b35;
  color: #fff;
}

.qty-stepper {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #fff;
  border: 1.5px solid #ff6b35;
  border-radius: 999px;
  padding: 0.25rem 0.5rem;
}

.qty-btn {
  width: 22px;
  height: 22px;
  border: none;
  background: #ff6b35;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  cursor: pointer;
}

.qty-value {
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 14px;
  text-align: center;
  color: #1a1a1a;
}

/* ── WhatsApp float ───────────────────────────────────────── */
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4);
  transition: all 0.2s ease;
  z-index: 60;
}

.whatsapp-float:hover {
  transform: scale(1.08);
}

.whatsapp-float.above-cart-bar {
  bottom: 96px;
}

/* ── Sticky cart bar ──────────────────────────────────────── */
.cart-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 70;
  padding: 0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom));
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.04), transparent);
}

.cart-bar-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  background: #1a9b52;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.95rem 1.1rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(26, 155, 82, 0.35);
  text-decoration: none;
}

.cart-bar-count {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.cart-bar-label {
  flex: 1;
  text-align: left;
}

.cart-bar-total {
  font-weight: 800;
}

/* ── Responsive ───────────────────────────────────────────── */
@media (min-width: 769px) {
  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-item {
    border-bottom: 1px solid #f0f0f0;
  }

  .product-item:nth-last-child(-n + 2) {
    border-bottom: none;
  }

  .product-item:nth-child(odd) {
    border-right: 1px solid #f0f0f0;
  }

  /* Sem isso o texto (flex:1) estica ate a borda da coluna e a imagem
     fica presa la na ponta, com um vao enorme no meio em telas largas */
  .product-info {
    flex: 0 1 420px;
    max-width: 420px;
  }

  .calcadao-pattern {
    width: min(38%, 420px);
    background-size: 180px;
    opacity: 0.6;
  }
}

@media (max-width: 480px) {
  .store-cover {
    height: 190px;
  }

  .store-avatar {
    width: 60px;
    height: 60px;
  }

  .store-name {
    font-size: 1.25rem;
  }

  .calcadao-pattern {
    width: 55%;
    opacity: 0.35;
    background-size: 90px;
  }
}

@media (max-width: 340px) {
  .calcadao-pattern {
    display: none;
  }

  .product-image-box {
    width: 76px;
    height: 76px;
  }
}
</style>
