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

            <!-- Cart -->
            <li class="nav-item">
              <router-link 
                :to="{name:'cart'}" 
                class="nav-link position-relative cart-link"
                :class="{ 'active': $route.name === 'cart' }"
                aria-label="Ir para o carrinho"
              >
                <i class="fas fa-shopping-cart me-1"></i>
                <span class="d-lg-none">Carrinho</span>
                <span 
                  v-if="productsCart.length > 0" 
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge"
                >
                  {{ productsCart.length }}
                  <span class="visually-hidden">itens no carrinho</span>
                </span>
              </router-link>
            </li>

            <!-- User Menu -->
            <li class="nav-item dropdown" v-if="me.name">
              <a 
                class="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                id="userDropdown" 
                role="button" 
                @click.prevent="toggleUserMenu"
                :aria-expanded="userMenuOpen.toString()"
                aria-label="Abrir menu do usuário"
              >
                <div class="user-avatar me-2">
                  <i class="fas fa-user-circle"></i>
                </div>
                <span class="user-name">{{ me.name }}</span>
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
            </li>

            <!-- Login Button -->
            <li class="nav-item" v-else>
              <router-link 
                :to="{name:'login'}" 
                class="nav-link login-btn"
                :class="{ 'active': $route.name === 'login' }"
                aria-label="Entrar"
              >
                <i class="fas fa-sign-in-alt me-1"></i>
                Entrar
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
/* Mesmas variáveis que você já usava */
:root {
  --ppgfood-primary: #2c3e50;
  --ppgfood-secondary: #e74c3c;
  --ppgfood-accent: #f39c12;
  --transition-speed: 0.3s;
}

/* Navbar */
.bg-ppgfood {
  background: linear-gradient(135deg, rgb(219, 19, 79) 0%, rgb(150, 0, 50) 100%) !important;
  backdrop-filter: blur(10px);
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

.nav-link.active,
.login-btn.active {
  background-color: var(--ppgfood-secondary) !important;
  color: #fff !important;
}

/* Cart */
.cart-badge {
  font-size: 0.75rem;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1);}
  50% { transform: scale(1.1);}
  100% { transform: scale(1);}
}

/* User menu */
.user-avatar i {
  font-size: 1.5rem;
  color: var(--ppgfood-accent);
}
.user-name {
  font-weight: 600;
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
  background: var(--ppgfood-secondary);
  color: #fff !important;
  border-radius: 22px;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: all var(--transition-speed) ease;
}
.login-btn:hover {
  background: #c0392b;
  box-shadow: 0 5px 14px rgba(231, 76, 60, 0.32);
  transform: translateY(-2px);
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
