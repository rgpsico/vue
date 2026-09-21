<template>
  <header>
    <nav class="navbar navbar-dark fixed-top bg-ppgfood shadow-lg">
      <div class="container">
        <!-- Logo/Brand -->
        <router-link :to="logoLink" class="navbar-brand d-flex align-items-center">
          <img
            src="@/assets/imgs/logo-cardapioproia.webp"
            alt="Cardápio PróIA"
            class="logo me-2"
            loading="lazy"
          >
        </router-link>

        <!-- Always-visible actions: cart + profile/login -->
        <div class="d-flex align-items-center top-actions">
          <router-link
            :to="{name:'cart'}"
            class="cart-icon-button"
            :class="{ 'active': $route.name === 'cart' }"
            aria-label="Ir para o carrinho"
          >
            <i class="fas fa-shopping-cart"></i>
            <span
              v-if="productsCart.length > 0"
              class="cart-badge"
            >
              {{ productsCart.length }}
              <span class="visually-hidden">itens no carrinho</span>
            </span>
          </router-link>

          <!-- User Menu -->
          <div class="dropdown user-menu" v-if="me.name">
            <a
              class="user-icon-button"
              href="#"
              id="userDropdown"
              role="button"
              @click.prevent="toggleUserMenu"
              :aria-expanded="userMenuOpen.toString()"
              aria-label="Abrir menu do usuário"
            >
              <i class="fas fa-user"></i>
            </a>
            <transition name="fade">
              <ul
                v-show="userMenuOpen"
                class="dropdown-menu dropdown-menu-end user-dropdown"
                :class="{ 'show': userMenuOpen }"
                aria-labelledby="userDropdown"
              >
                <li class="user-dropdown-header">{{ me.name }}</li>
                <li>
                  <router-link :to="{name:'my.orders'}" class="dropdown-item">
                    <i class="fas fa-box me-2"></i>
                    Meus Pedidos
                  </router-link>
                </li>
                <li>
                  <router-link :to="{name:'profile'}" class="dropdown-item">
                    <i class="fas fa-user me-2"></i>
                    Meu Perfil
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a
                    href="#"
                    class="dropdown-item text-danger"
                    @click.prevent="handleLogout"
                  >
                    <i class="fas fa-sign-out-alt me-2"></i>
                    Sair
                  </a>
                </li>
              </ul>
            </transition>
          </div>

          <!-- Login Button -->
          <router-link
            v-else
            :to="{name:'login'}"
            class="user-icon-button"
            :class="{ 'active': $route.name === 'login' }"
            aria-label="Entrar"
          >
            <i class="fas fa-sign-in-alt"></i>
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AppHeader',
  
  data() {
    return {
      userMenuOpen: false
    }
  },

  computed: {
    ...mapState({
      productsCart: state => state.cart.products,
      me: state => state.auth.me,
      companyFlag: state => state.companies.companySelected.flag
    }),

    // Enquanto o usuário está navegando dentro de uma barraca (cardápio,
    // carrinho ou pedido), o logo deve levar de volta pra ela, não pra
    // lista geral de lojas - cada barraca tem seu próprio cardápio.
    insideStoreRoutes() {
      return ['products', 'cart', 'order.detail'].includes(this.$route.name)
    },

    logoLink() {
      if (this.insideStoreRoutes && this.companyFlag) {
        return { name: 'products', params: { companyFlag: this.companyFlag } }
      }
      return { name: 'home' }
    }
  },

  methods: {
    ...mapActions([
      'logout'
    ]),

    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
    },

    async handleLogout() {
      try {
        await this.logout()
        this.userMenuOpen = false
        this.$router.push({ name: 'home' })
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      }
    },

    handleClickOutside(event) {
      // Fecha user dropdown ao clicar fora dele
      const userDropdown = this.$el.querySelector('.user-dropdown')
      const userToggle = this.$el.querySelector('#userDropdown')
      if (
        this.userMenuOpen &&
        userDropdown &&
        !userDropdown.contains(event.target) &&
        !userToggle.contains(event.target)
      ) {
        this.userMenuOpen = false
      }
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
:root {
  --ppgfood-primary: #2c3e50;
  --ppgfood-secondary: #ff6b35;
  --ppgfood-accent: #ff6b35;
  --transition-speed: 0.3s;
}

/* Navbar */
.bg-ppgfood {
  background: #b3134f !important;
}

.navbar {
  padding: 0.6rem 0;
  min-height: 65px;
}

/* Brand */
.navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
  transition: transform var(--transition-speed) ease;
}

.navbar-brand:hover {
  transform: scale(1.03);
}

.logo {
  height: 36px;
  width: auto;
}

/* Nav links */
.nav-link {
  font-weight: 500;
  padding: 0.65rem 1rem !important;
  border-radius: 8px;
  transition: all var(--transition-speed) ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.16) !important;
  color: #fff !important;
}

/* Top-right actions: always-visible cart icon + mobile toggler */
.top-actions {
  gap: 0.75rem;
}

.cart-icon-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #fff;
  font-size: 1.15rem;
  text-decoration: none;
  border-radius: 8px;
  transition: all var(--transition-speed) ease;
}

.cart-icon-button:hover,
.cart-icon-button.active {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--ppgfood-accent);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 2px solid #b3134f;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1);}
  50% { transform: scale(1.1);}
  100% { transform: scale(1);}
}

/* User menu / login — same minimal icon style as the cart */
.user-menu {
  position: relative;
}

.user-icon-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #fff;
  font-size: 1.1rem;
  text-decoration: none;
  border-radius: 8px;
  transition: all var(--transition-speed) ease;
}

.user-icon-button:hover,
.user-icon-button.active {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.user-dropdown {
  border: none;
  box-shadow: 0 8px 25px rgba(0,0,0,0.18);
  border-radius: 12px;
  padding: 0.4rem 0;
  min-width: 200px;
  background: #fff;
  margin-top: 0.6rem;
  z-index: 1200;
}

.user-dropdown-header {
  padding: 0.6rem 1.2rem 0.4rem;
  font-weight: 700;
  color: #1a1a1a;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item {
  padding: 0.7rem 1.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all var(--transition-speed) ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
  padding-left: 1.8rem;
}

.dropdown-item i {
  width: 22px;
}

/* Transições e fade do menu */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .user-dropdown {
    background: #2c3e50;
    color: #fff;
  }
  .dropdown-item {
    color: #fff;
  }
  .dropdown-item:hover {
    background: rgba(255,255,255,0.12);
  }
}
</style>
