<template>
  <div class="cart-page">
    <div class="cart-header">
      <h1>Seu carrinho</h1>
      <router-link class="btn-continue" :to="continueShoppingLink">
        <i class="fa-solid fa-arrow-left"></i> Continuar comprando
      </router-link>
    </div>

    <div v-if="products.length === 0" class="cart-empty">
      <i class="fa-solid fa-cart-shopping cart-empty-icon"></i>
      <p>Seu carrinho está vazio.</p>
      <router-link class="btn-primary-pill" :to="continueShoppingLink">
        Ver cardápio
      </router-link>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <div class="cart-item" v-for="(item, index) in products" :key="index">
          <div class="cart-item-image">
            <img :src="item.product.image" :alt="item.product.title" />
          </div>

          <div class="cart-item-info">
            <h3>{{ item.product.title }}</h3>
            <p class="cart-item-desc">{{ item.product.description }}</p>

            <div class="cart-item-footer">
              <span class="cart-item-price">R$ {{ item.product.price }}</span>

              <div class="qty-stepper">
                <button class="qty-btn" @click="decrementQty(item.product)">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="qty-value">{{ item.qty }}</span>
                <button class="qty-btn" @click="incrementQty(item.product)">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <button
            class="cart-item-remove"
            @click.prevent="removeCart(item.product)"
            aria-label="Remover item"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <checkout />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Checkout from "./_partials/Checkout.vue";

export default {
  computed: {
    ...mapState({
      products: (state) => state.cart.products,
      companyFlag: (state) => state.companies.companySelected.flag,
    }),

    // Continuar comprando deve voltar pra loja atual (cada barraca tem
    // seu proprio cardapio), nao pra listagem geral de lojas.
    continueShoppingLink() {
      return this.companyFlag
        ? { name: "products", params: { companyFlag: this.companyFlag } }
        : { name: "home" };
    },
  },

  methods: {
    ...mapMutations({
      removeCart: "REMOVE_PROD_CART",
      incrementQty: "INCREMENT_QTY_PROD_CART",
      decrementQty: "DECREMENT_QTY_PROD_CART",
    }),
  },

  components: {
    Checkout,
  },
};
</script>

<style scoped>
.cart-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.cart-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0;
}

.btn-continue {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ff6b35;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}

.btn-continue:hover {
  color: #f7931e;
}

.cart-empty {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.cart-empty-icon {
  font-size: 48px;
  color: #ffcbb0;
  margin-bottom: 16px;
}

.cart-empty p {
  font-size: 1rem;
  margin-bottom: 20px;
}

.btn-primary-pill {
  display: inline-block;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: #fff;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
}

.cart-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.cart-items {
  flex: 1 1 60%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 14px;
}

.cart-item-image {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #f4f4f4;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-info h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 2px;
}

.cart-item-desc {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 0 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.cart-item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cart-item-price {
  font-weight: 700;
  color: #2c3e50;
  font-size: 0.9rem;
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

.cart-item-remove {
  align-self: flex-start;
  border: none;
  background: transparent;
  color: #dc3545;
  opacity: 0.6;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 6px;
}

.cart-item-remove:hover {
  opacity: 1;
}

.cart-summary {
  flex: 1 1 36%;
  min-width: 280px;
  position: sticky;
  top: 72px;
}

@media (max-width: 768px) {
  .cart-layout {
    flex-direction: column;
  }

  .cart-summary {
    position: static;
    width: 100%;
  }
}
</style>
