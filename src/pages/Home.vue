<!-- RESTAURANTS LIST COMPONENT -->
<template>
  <div class="restaurants-container">
    <div class="row">
      <div class="col-12">
        <div class="page-header text-center mb-5">
          <h1 class="display-4 title-gradient">Restaurantes</h1>
          <p class="lead text-muted">Descubra os melhores sabores da sua região</p>
        </div>
        
        <!-- Search and Filter Section -->
        <div class="search-section mb-5">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
              <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input 
                  type="text" 
                  class="form-control search-input" 
                  placeholder="Buscar restaurantes..."
                  v-model="searchTerm"
                >
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div class="text-center py-5" v-if="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-3 text-muted">Carregando restaurantes...</p>
        </div>
        
        <!-- Restaurants Grid -->
        <div class="restaurants-grid" v-else>
          <div
            class="restaurant-card-wrapper"
            v-for="(company, index) in filteredCompanies"
            :key="index"
          >
            <div class="restaurant-card" @click="goStoreCompany(company)">
              <div class="card-image-container">
                <img
                  v-if="company.image"
                  class="card-image"
                  :src="company.image"
                  :alt="company.name"
                />
                <img
                  v-else
                  class="card-image"
                  src="@/assets/imgs/vue-food.png"
                  :alt="company.name"
                />
                <div class="card-overlay">
                  <i class="fas fa-eye view-icon"></i>
                </div>
              </div>
              
              <div class="card-content">
                <h3 class="restaurant-name">{{ company.name }}</h3>
                <p class="restaurant-description" v-if="company.description">
                  {{ company.description }}
                </p>
                <div class="restaurant-info">
                  <div class="info-item" v-if="company.rating">
                    <i class="fas fa-star text-warning"></i>
                    <span>{{ company.rating }}</span>
                  </div>
                  <div class="info-item" v-if="company.delivery_time">
                    <i class="fas fa-clock text-info"></i>
                    <span>{{ company.delivery_time }}</span>
                  </div>
                  <div class="info-item" v-if="company.delivery_price">
                    <i class="fas fa-motorcycle text-success"></i>
                    <span>R$ {{ company.delivery_price }}</span>
                  </div>
                </div>
              </div>
              
              <div class="card-action">
                <button class="btn btn-primary btn-view-menu">
                  <i class="fas fa-utensils me-2"></i>
                  Ver Cardápio
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div class="text-center py-5" v-if="!loading && filteredCompanies.length === 0">
          <div class="empty-state">
            <i class="fas fa-store-slash empty-icon"></i>
            <h3 class="mt-3">Nenhum restaurante encontrado</h3>
            <p class="text-muted">Tente ajustar sua busca ou verifique novamente mais tarde.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      searchTerm: '',
      loading: true
    }
  },
  
  mounted() {
    this.loadCompanies();
  },
  
  computed: {
    ...mapState({
      companies: (state) => state.companies.items,
    }),
    
    filteredCompanies() {
      if (!this.companies.data) return [];
      
      if (!this.searchTerm) {
        return this.companies.data;
      }
      
      return this.companies.data.filter(company =>
        company.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  
  methods: {
    ...mapActions(["getCompanies"]),
    ...mapMutations({
      setCompany: "SET_COMPANY_SELECTED",
    }),
    
    async loadCompanies() {
      try {
        this.loading = true;
        await this.getCompanies();
      } catch (error) {
        this.$vToastify.error("Falha ao carregar restaurantes", "Erro");
      } finally {
        this.loading = false;
      }
    },
    
    goStoreCompany(company) {
      this.setCompany(company);
      this.$router.push({
        name: "products",
        params: { companyFlag: company.flag },
      });
    },
  },
};
</script>

<style scoped>
.restaurants-container {
  padding-top: 100px; /* Account for fixed navbar */
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.title-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.search-section {
  position: relative;
}

.search-box {
  position: relative;
}

.search-input {
  padding: 15px 20px 15px 50px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 5px 30px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 10;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.restaurant-card-wrapper {
  display: flex;
}

.restaurant-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.restaurant-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}

.card-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.restaurant-card:hover .card-image {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.restaurant-card:hover .card-overlay {
  opacity: 1;
}

.view-icon {
  color: white;
  font-size: 2rem;
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.restaurant-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.restaurant-description {
  color: #6c757d;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.restaurant-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6c757d;
}

.card-action {
  padding: 0 1.5rem 1.5rem;
}

.btn-view-menu {
  width: 100%;
  padding: 12px;
  border-radius: 50px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-view-menu:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.empty-state {
  padding: 3rem;
}

.empty-icon {
  font-size: 4rem;
  color: #dee2e6;
}

@media (max-width: 768px) {
  .restaurants-container {
    padding-top: 80px;
  }
  
  .restaurants-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
  
  .search-input {
    font-size: 1rem;
    padding: 12px 15px 12px 45px;
  }
  
  .restaurant-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .card-content {
    padding: 1rem;
  }
  
  .restaurant-name {
    font-size: 1.2rem;
  }
  
  .card-action {
    padding: 0 1rem 1rem;
  }
}
</style>