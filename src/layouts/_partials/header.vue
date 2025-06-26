<template>
  <header>
    <!-- Meta tag para responsividade -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <!-- Navigation -->
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
          <!-- <span class="brand-text d-none d-md-inline">PPGFOOD</span> -->
        </router-link>

        <!-- Mobile Toggle Button -->
        <button 
          class="navbar-toggler border-0" 
          type="button" 
          @click="toggleMobileMenu"
          :class="{ 'collapsed': !mobileMenuOpen }"
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation Menu -->
        <div class="navbar-collapse" :class="{ 'show': mobileMenuOpen }" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            <!-- Search (opcional) -->
            <li class="nav-item d-lg-none mb-2">
              <form class="d-flex" role="search">
                <input 
                  class="form-control form-control-sm me-2" 
                  type="search" 
                  placeholder="Buscar produtos..." 
                  aria-label="Search"
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
                :class="{ 'show': userMenuOpen }"
                aria-expanded="false"
              >
                <div class="user-avatar me-2">
                  <i class="fas fa-user-circle"></i>
                </div>
                <span class="user-name">{{ me.name }}</span>
              </a>
              <ul 
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
            </li>

            <!-- Login Button -->
            <li class="nav-item" v-else>
              <router-link 
                :to="{name:'login'}" 
                class="nav-link login-btn"
                :class="{ 'active': $route.name === 'login' }"
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
      this.userMenuOpen = false // Fecha o menu do usuário
    },

    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
      this.mobileMenuOpen = false // Fecha o menu mobile
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

    // Fecha menus quando clica fora
    handleClickOutside(event) {
      const userDropdown = this.$el.querySelector('.user-dropdown')
      const userToggle = this.$el.querySelector('#userDropdown')
      
      if (userDropdown && !userDropdown.contains(event.target) && !userToggle.contains(event.target)) {
        this.userMenuOpen = false
      }
    }
  },

  mounted() {
    // Adiciona listener para fechar menus ao clicar fora
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    // Remove listener
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
/* Variáveis CSS customizadas */
:root {
  --ppgfood-primary: #2c3e50;
  --ppgfood-secondary: #e74c3c;
  --ppgfood-accent: #f39c12;
  --transition-speed: 0.3s;
}

/* Navbar principal */
.bg-ppgfood {
  background: linear-gradient(
  135deg,
  rgb(219, 19, 79) 0%,
  rgb(150, 0, 50)   100%
) !important;
  backdrop-filter: blur(10px);
  transition: all var(--transition-speed) ease;
}

.navbar {
  padding: 0.75rem 0;
  min-height: 70px;
}

/* Logo e Brand */
.navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
  transition: transform var(--transition-speed) ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.logo {
  height: 40px;
  width: auto;
  transition: all var(--transition-speed) ease;
}

.brand-text {
  color: var(--ppgfood-accent);
  font-weight: 800;
  letter-spacing: 1px;
}

/* Navigation Links */
.nav-link {
  font-weight: 500;
  padding: 0.75rem 1rem !important;
  border-radius: 8px;
  transition: all var(--transition-speed) ease;
  position: relative;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.active {
  background-color: var(--ppgfood-secondary);
  color: white !important;
}

/* Cart Badge */
.cart-link {
  position: relative;
}

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
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* User Avatar */
.user-avatar i {
  font-size: 1.5rem;
  color: var(--ppgfood-accent);
}

.user-name {
  font-weight: 600;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Dropdown Menu */
.user-dropdown {
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 0.5rem 0;
  min-width: 200px;
  background: white;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all var(--transition-speed) ease;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  padding-left: 2rem;
}

.dropdown-item i {
  width: 20px;
  text-align: center;
}

/* Login Button */
.login-btn {
  background-color: var(--ppgfood-secondary);
  color: white !important;
  border-radius: 25px;
  font-weight: 600;
  margin-left: 0.5rem;
}

.login-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
}

/* Mobile Toggle */
.navbar-toggler {
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

/* Responsive */
@media (max-width: 991.98px) {
  .navbar-collapse {
    background-color: rgba(44, 62, 80, 0.95);
    border-radius: 12px;
    margin-top: 1rem;
    padding: 1rem;
    backdrop-filter: blur(10px);
  }
  
  .nav-link {
    margin: 0.25rem 0;
  }
  
  .user-dropdown {
    position: static !important;
    float: none;
    width: 100%;
    margin-top: 0.5rem;
    box-shadow: none;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .dropdown-item {
    color: white;
  }
  
  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .user-dropdown {
    background-color: #2c3e50;
    color: white;
  }
  
  .dropdown-item {
    color: white;
  }
  
  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>