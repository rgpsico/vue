<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top bg-ppgfood shadow-lg">
      <div class="container">
        <!-- Logo/Brand -->
        <router-link :to="{name:'home'}" class="navbar-brand d-flex align-items-center">
          <img 
            src="@/assets/imgs/logo-vuefood.png" 
            alt="PPGFOOD" 
            class="logo me-2"
            loading="lazy"
          >
        </router-link>

        <!-- Mobile Toggle Button -->
        <button 
          class="navbar-toggler border-0" 
          type="button" 
          @click="toggleMobileMenu"
          :aria-expanded="mobileMenuOpen.toString()"
          aria-label="Abrir menu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation Menu -->
        <div class="navbar-collapse" :class="{ 'show': mobileMenuOpen }" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            <!-- Search (opcional, só no mobile) -->
            <li class="nav-item d-lg-none mb-2">
              <form class="d-flex" role="search">
                <input 
                  class="form-control form-control-sm me-2" 
                  type="search" 
                  placeholder="Buscar produtos..." 
                  aria-label="Buscar"
                >
                <button class="btn btn-outline-light btn-sm" type="submit">
                  <i class="fas fa-search"></i>
                </button>
              </form>
            </li>

            <!-- Actions cluster: cart + login/user -->
            <li class="nav-item d-flex align-items-center actions-cluster">
              <router-link
                :to="{name:'cart'}"
                class="cart-button"
                :class="{ 'active': $route.name === 'cart' }"
                aria-label="Ir para o carrinho"
              >
                <i class="fas fa-shopping-cart"></i>
                <span class="d-lg-none ms-2">Carrinho</span>
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
                  class="user-toggle d-flex align-items-center"
                  href="#"
                  id="userDropdown"
                  role="button"
                  @click.prevent="toggleUserMenu"
                  :aria-expanded="userMenuOpen.toString()"
                  aria-label="Abrir menu do usuário"
                >
                  <div class="user-avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <span class="user-name d-none d-lg-inline">{{ me.name }}</span>
                </a>
                <transition name="fade">
                  <ul
                    v-show="userMenuOpen"
                    class="dropdown-menu dropdown-menu-end user-dropdown"
                    :class="{ 'show': userMenuOpen }"
                    aria-labelledby="userDropdown"
                  >
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
                class="login-btn"
                :class="{ 'active': $route.name === 'login' }"
                aria-label="Entrar"
              >
                <i class="fas fa-sign-in-alt"></i>
                <span>Entrar</span>
              </router-link>
            </li>
          </ul>
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
      mobileMenuOpen: false,
      userMenuOpen: false
    }
  },

  computed: {
    ...mapState({
      productsCart: state => state.cart.products,
      me: state => state.auth.me
    })
  },

  methods: {
    ...mapActions([
      'logout'
    ]),

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
      if (this.mobileMenuOpen) this.userMenuOpen = false
    },

    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
      if (this.userMenuOpen) this.mobileMenuOpen = false
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
      // Fecha menu mobile ao clicar fora
      const navbarCollapse = this.$el.querySelector('.navbar-collapse')
      const toggler = this.$el.querySelector('.navbar-toggler')
      if (
        this.mobileMenuOpen &&
        navbarCollapse &&
        !navbarCollapse.contains(event.target) &&
        !toggler.contains(event.target)
      ) {
        this.mobileMenuOpen = false
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

/* Actions cluster (cart + login/user) */
.actions-cluster {
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.cart-button {
  position: relative;
  display: flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  transition: all var(--transition-speed) ease;
}

.cart-button:hover,
.cart-button.active {
  background: rgba(255, 255, 255, 0.22);
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

/* User menu */
.user-menu {
  position: relative;
}

.user-toggle {
  gap: 0.5rem;
  padding: 0.4rem 0.9rem 0.4rem 0.4rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  text-decoration: none;
  transition: all var(--transition-speed) ease;
}

.user-toggle:hover {
  background: rgba(255, 255, 255, 0.22);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ppgfood-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar i {
  font-size: 0.9rem;
  color: #fff;
}

.user-name {
  font-weight: 600;
  color: #fff;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-dropdown {
  border: none;
  box-shadow: 0 8px 25px rgba(0,0,0,0.18);
  border-radius: 12px;
  padding: 0.4rem 0;
  min-width: 185px;
  background: #fff;
  margin-top: 0.6rem;
  z-index: 1200;
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

/* Login */
.login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--ppgfood-accent);
  color: #fff !important;
  text-decoration: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.55rem 1.1rem;
  transition: all var(--transition-speed) ease;
}
.login-btn:hover {
  background: #e85a2a;
  box-shadow: 0 5px 14px rgba(255, 107, 53, 0.4);
  transform: translateY(-2px);
}
.login-btn.active {
  background: #e85a2a;
}

/* Mobile styles */
@media (max-width: 991.98px) {
  .navbar-collapse {
    background: rgba(44, 62, 80, 0.97);
    border-radius: 12px;
    margin-top: 1rem;
    padding: 1rem;
    backdrop-filter: blur(10px);
    z-index: 1110;
  }
  .nav-link {
    margin: 0.2rem 0;
  }
  .actions-cluster {
    margin-left: 0;
    margin-top: 0.5rem;
    justify-content: space-between;
  }
  .cart-button {
    flex: 1;
    justify-content: center;
  }
  .user-dropdown {
    position: static !important;
    width: 100%;
    margin-top: 0.5rem;
    box-shadow: none;
    background: rgba(255,255,255,0.10);
    color: #fff;
  }
  .dropdown-item {
    color: #fff;
  }
  .dropdown-item:hover {
    background: rgba(255,255,255,0.12);
    color: #fff;
  }
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
