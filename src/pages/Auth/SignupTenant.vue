<template>
  <div class="signup-page">
    <div class="signup-card">
      <div class="signup-logo-badge">
        <router-link :to="{ name: 'home' }">
          <img
            src="@/assets/imgs/logo-cardapioproia.webp"
            class="signup-logo"
            alt="Cardápio PróIA"
          />
        </router-link>
      </div>

      <h1 class="signup-title">Crie sua barraca</h1>
      <p class="signup-subtitle">
        Cadastre em menos de 1 minuto e comece a receber pedidos hoje mesmo
      </p>

      <form @submit.prevent="signup" class="signup-form">
        <div class="form-group">
          <label for="tenant_name">Nome da barraca</label>
          <input
            id="tenant_name"
            type="text"
            v-model="formData.tenant_name"
            class="form-control"
            :class="{ 'is-invalid': errors.tenant_name }"
            placeholder="Ex: Barraca do Zé"
          />
          <p class="field-error" v-if="errors.tenant_name">
            {{ errors.tenant_name[0] }}
          </p>
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            id="email"
            type="email"
            v-model="formData.email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="voce@email.com"
          />
          <p class="field-error" v-if="errors.email">{{ errors.email[0] }}</p>
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            type="password"
            v-model="formData.password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            placeholder="Mínimo 6 caracteres"
          />
          <p class="field-error" v-if="errors.password">{{ errors.password[0] }}</p>
        </div>

        <div class="form-group">
          <label for="umbrella_count">Quantos guarda-sóis?</label>
          <input
            id="umbrella_count"
            type="number"
            min="1"
            :max="maxUmbrellas"
            v-model.number="formData.umbrella_count"
            class="form-control"
            :class="{ 'is-invalid': errors.umbrella_count }"
            :placeholder="`De 1 até ${maxUmbrellas}`"
          />
          <p class="field-error" v-if="errors.umbrella_count">
            {{ errors.umbrella_count[0] }}
          </p>
          <p class="field-hint">
            Cria um guarda-sol numerado pra cada um automaticamente — dá pra
            ajustar depois no painel.
          </p>
        </div>

        <button type="submit" class="btn-create" :disabled="loading">
          {{ loading ? "Criando sua barraca..." : "Criar minha barraca" }}
        </button>
      </form>

      <p class="signup-footer">
        Já tem conta?
        <router-link :to="{ name: 'login' }">Entrar</router-link>
      </p>
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
.signup-page {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 16px 40px;
}

.signup-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  padding: 50px 32px 32px;
}

.signup-logo-badge {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  height: 70px;
  width: 220px;
  border-radius: 16px;
  background: #b3134f;
  padding: 10px 16px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.signup-logo {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.signup-title {
  text-align: center;
  font-size: 1.4rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 6px;
}

.signup-subtitle {
  text-align: center;
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0 0 28px;
}

.signup-form .form-group {
  margin-bottom: 18px;
}

.signup-form label {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 6px;
}

.signup-form .form-control {
  width: 100%;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 0.9rem;
  color: #1a1a1a;
  background: #fff;
  transition: border-color 0.15s ease;
}

.signup-form .form-control:focus {
  outline: none;
  border-color: #ff6b35;
}

.signup-form .form-control.is-invalid {
  border-color: #dc3545;
}

.field-error {
  color: #dc3545;
  font-size: 0.78rem;
  margin: 6px 0 0;
}

.field-hint {
  color: #6c757d;
  font-size: 0.75rem;
  margin: 6px 0 0;
}

.btn-create {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 14px;
  border-radius: 999px;
  cursor: pointer;
  margin-top: 6px;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
}

.btn-create:disabled {
  opacity: 0.7;
  cursor: default;
}

.btn-create:hover:not(:disabled) {
  filter: brightness(1.05);
}

.signup-footer {
  text-align: center;
  font-size: 0.85rem;
  color: #6c757d;
  margin: 22px 0 0;
}

.signup-footer a {
  color: #ff6b35;
  font-weight: 700;
  text-decoration: none;
  margin-left: 4px;
}
</style>
