<template>
  <div>
    <div class="d-flex justify-content-center h-100 my-5">
      <div class="user_card">
        <div class="d-flex justify-content-center">
          <div class="brand_logo_container">
            <router-link :to="{ name: 'home' }">
              <img
                src="@/assets/imgs/logo-cardapioproia.webp"
                class="brand_logo"
                alt="Cardápio PróIA"
              />
            </router-link>
          </div>
        </div>

        <p class="signup-tenant-subtitle">
          Cadastre sua barraca e comece a receber pedidos hoje mesmo
        </p>

        <div class="d-flex justify-content-center form_container">
          <form @submit.prevent="signup">
            <div class="text-danger" v-if="errors.tenant_name">
              {{ errors.tenant_name[0] || "" }}
            </div>
            <div class="input-group">
              <div class="input-group-append">
                <span class="input-group-text"><i class="fas fa-umbrella-beach"></i></span>
              </div>
              <input
                type="text"
                v-model="formData.tenant_name"
                name="tenant_name"
                :class="['form-control', 'input_user', { 'is-invalid': errors.tenant_name }]"
                placeholder="Nome da barraca"
              />
            </div>

            <div class="text-danger" v-if="errors.email">
              {{ errors.email[0] || "" }}
            </div>
            <div class="input-group">
              <div class="input-group-append">
                <span class="input-group-text"><i class="fas fa-envelope"></i></span>
              </div>
              <input
                type="email"
                v-model="formData.email"
                name="email"
                :class="['form-control', 'input_user', { 'is-invalid': errors.email }]"
                placeholder="E-mail"
              />
            </div>

            <div class="text-danger" v-if="errors.password">
              {{ errors.password[0] || "" }}
            </div>
            <div class="input-group">
              <div class="input-group-append">
                <span class="input-group-text"><i class="fas fa-key"></i></span>
              </div>
              <input
                type="password"
                v-model="formData.password"
                name="password"
                :class="['form-control', 'input_user', { 'is-invalid': errors.password }]"
                placeholder="Senha"
              />
            </div>

            <div class="text-danger" v-if="errors.umbrella_count">
              {{ errors.umbrella_count[0] || "" }}
            </div>
            <div class="input-group">
              <div class="input-group-append">
                <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
              </div>
              <input
                type="number"
                min="1"
                :max="maxUmbrellas"
                v-model.number="formData.umbrella_count"
                name="umbrella_count"
                :class="['form-control', 'input_user', { 'is-invalid': errors.umbrella_count }]"
                :placeholder="`Quantos guarda-sóis? (máx. ${maxUmbrellas})`"
              />
            </div>
            <p class="signup-tenant-hint">
              Cria um guarda-sol numerado pra cada um automaticamente — dá pra ajustar depois no painel.
            </p>

            <div class="d-flex justify-content-center login_container">
              <button type="submit" class="btn login_btn" :disabled="loading">
                <span v-if="loading">criando sua barraca...</span>
                <span v-else>Criar minha barraca</span>
              </button>
            </div>
          </form>
        </div>

        <div class="mt-4">
          <div class="d-flex justify-content-center links">
            Já tem conta?
            <router-link :to="{ name: 'login' }" class="ml-2">Login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const PAINEL_URL = "https://painel.comunidadeppg.com.br";

export default {
  data() {
    return {
      loading: false,
      maxUmbrellas: 20,
      formData: {
        tenant_name: "",
        email: "",
        password: "",
        umbrella_count: 5,
      },
      errors: {},
    };
  },

  methods: {
    signup() {
      this.errors = {};
      this.loading = true;

      axios
        .post("tenant/signup", this.formData)
        .then((response) => {
          this.$vToastify.success(
            "Barraca criada! Redirecionando para o painel...",
            "Parabéns"
          );

          const token = response.data.token;
          window.location.href = `${PAINEL_URL}/?token=${encodeURIComponent(token)}`;
        })
        .catch((error) => {
          const errorResponse = error.response;

          if (errorResponse && errorResponse.status === 422) {
            this.errors = errorResponse.data.errors || {
              tenant_name: [errorResponse.data.message],
            };
            this.$vToastify.error("Verifique os dados e tente de novo", "Erro");
            return;
          }

          this.$vToastify.error("Não foi possível criar a barraca", "Erro");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.signup-tenant-subtitle {
  text-align: center;
  color: #6c757d;
  font-size: 0.85rem;
  margin: 10px 0 0;
  padding: 0 20px;
}

.signup-tenant-hint {
  color: #6c757d;
  font-size: 0.75rem;
  margin: -8px 0 12px;
}
</style>
