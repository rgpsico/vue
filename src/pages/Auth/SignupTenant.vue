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

      <!-- Progresso (so aparece depois da tela de boas-vindas) -->
      <div class="signup-progress" v-if="currentStep > 0">
        <span
          v-for="step in totalFormSteps"
          :key="step"
          class="progress-dot"
          :class="{ active: step <= currentStep }"
        ></span>
      </div>

      <!-- Passo 0: Boas-vindas -->
      <div v-if="currentStep === 0" class="signup-step signup-welcome">
        <div class="welcome-icon">🏖️</div>
        <h1 class="signup-title">Bem-vindo(a) ao Barraca Digital!</h1>
        <p class="signup-subtitle">
          Vamos criar o ambiente da sua barraca em poucos passos — leva menos
          de 1 minuto e você já cai direto no painel de pedidos.
        </p>
        <button type="button" class="btn-create" @click="currentStep = 1">
          Vamos começar
        </button>
        <p class="signup-footer">
          Já tem conta?
          <router-link :to="{ name: 'login' }">Entrar</router-link>
        </p>
      </div>

      <!-- Passo 1: Nome da barraca -->
      <form
        v-else-if="currentStep === 1"
        @submit.prevent="goToStep(2)"
        class="signup-step signup-form"
      >
        <h2 class="step-title">Qual o nome da sua barraca?</h2>
        <p class="step-subtitle">É assim que seus clientes vão te encontrar</p>

        <div class="form-group">
          <input
            id="tenant_name"
            type="text"
            v-model="formData.tenant_name"
            class="form-control"
            :class="{ 'is-invalid': errors.tenant_name }"
            placeholder="Ex: Barraca do Zé"
            autofocus
          />
          <p class="field-error" v-if="errors.tenant_name">
            {{ errors.tenant_name[0] }}
          </p>
        </div>

        <div class="step-actions">
          <button type="submit" class="btn-create">Próximo</button>
        </div>
      </form>

      <!-- Passo 2: Login -->
      <form
        v-else-if="currentStep === 2"
        @submit.prevent="goToStep(3)"
        class="signup-step signup-form"
      >
        <h2 class="step-title">Como você vai acessar o painel?</h2>
        <p class="step-subtitle">Guarde bem esses dados — é seu login</p>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            id="email"
            type="email"
            v-model="formData.email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="voce@email.com"
            autofocus
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

        <div class="step-actions step-actions-split">
          <button type="button" class="btn-back" @click="currentStep = 1">
            Voltar
          </button>
          <button type="submit" class="btn-create">Próximo</button>
        </div>
      </form>

      <!-- Passo 3: Guarda-sois -->
      <form
        v-else-if="currentStep === 3"
        @submit.prevent="signup"
        class="signup-step signup-form"
      >
        <h2 class="step-title">Quantos guarda-sóis tem sua barraca?</h2>
        <p class="step-subtitle">
          Cria um guarda-sol numerado pra cada um automaticamente — dá pra
          ajustar depois no painel.
        </p>

        <div class="form-group">
          <input
            id="umbrella_count"
            type="number"
            min="1"
            :max="maxUmbrellas"
            v-model.number="formData.umbrella_count"
            class="form-control"
            :class="{ 'is-invalid': errors.umbrella_count }"
            :placeholder="`De 1 até ${maxUmbrellas}`"
            autofocus
          />
          <p class="field-error" v-if="errors.umbrella_count">
            {{ errors.umbrella_count[0] }}
          </p>
        </div>

        <div class="step-actions step-actions-split">
          <button type="button" class="btn-back" @click="currentStep = 2" :disabled="loading">
            Voltar
          </button>
          <button type="submit" class="btn-create" :disabled="loading">
            {{ loading ? "Criando sua barraca..." : "Criar minha barraca" }}
          </button>
        </div>
      </form>
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
      currentStep: 0,
      totalFormSteps: 3,
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
    goToStep(step) {
      this.errors = {};

      if (step === 2 && this.formData.tenant_name.trim().length < 3) {
        this.errors = { tenant_name: ["Digite pelo menos 3 letras"] };
        return;
      }

      if (step === 3) {
        if (!this.isValidEmail(this.formData.email)) {
          this.errors = { email: ["Digite um e-mail válido"] };
          return;
        }
        if (this.formData.password.length < 6) {
          this.errors = { password: ["A senha precisa ter pelo menos 6 caracteres"] };
          return;
        }
      }

      this.currentStep = step;
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

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

.signup-progress {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #eee;
  transition: background 0.2s ease;
}

.progress-dot.active {
  background: #ff6b35;
}

.signup-step {
  animation: step-fade-in 0.25s ease;
}

@keyframes step-fade-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.signup-welcome {
  text-align: center;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 12px;
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
  line-height: 1.5;
}

.step-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 4px;
}

.step-subtitle {
  color: #6c757d;
  font-size: 0.82rem;
  margin: 0 0 20px;
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

.step-actions {
  margin-top: 8px;
}

.step-actions-split {
  display: flex;
  gap: 12px;
}

.step-actions-split .btn-back {
  flex: 1;
}

.step-actions-split .btn-create {
  flex: 2;
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
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
}

.btn-create:disabled {
  opacity: 0.7;
  cursor: default;
}

.btn-create:hover:not(:disabled) {
  filter: brightness(1.05);
}

.btn-back {
  border: 1.5px solid #e5e5e5;
  background: #fff;
  color: #2c3e50;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 14px;
  border-radius: 999px;
  cursor: pointer;
}

.btn-back:disabled {
  opacity: 0.6;
  cursor: default;
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
