<template>
  <div>
    <!-- login -->
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
        <div class="d-flex justify-content-center form_container">
          <form @submit.prevent="registerClient">
            <p class="register-hint">Só 3 informações e você já pode pedir.</p>

            <div class="text-danger" v-if="errors.name != ''">
              {{ errors.name[0] || "" }}
            </div>
            <div class="input-group">
              <div class="input-group-append">
                <span class="input-group-text"><i class="fas fa-user"></i></span>
              </div>
              <input
                type="text"
                v-model="formData.name"
                name="name"
                autocomplete="name"
                autocapitalize="words"
                :class="['form-control', 'input_user', { 'is-invalid': errors.name != '' }]"
                placeholder="Seu nome"
              />
            </div>

            <div class="text-danger" v-if="errors.telefone != ''">
              {{ errors.telefone[0] || "" }}
            </div>
            <div class="input-group">
              <div class="input-group-append">
                <span class="input-group-text"><i class="fas fa-phone"></i></span>
              </div>
              <input
                type="tel"
                inputmode="tel"
                v-model="formData.telefone"
                name="telefone"
                autocomplete="tel"
                :class="['form-control', 'input_user', { 'is-invalid': errors.telefone != '' }]"
                placeholder="Celular com DDD"
              />
            </div>

            <div class="text-danger" v-if="errors.password != ''">
              {{ errors.password[0] || "" }}
            </div>
            <div class="input-group">
              <div class="input-group-append">
                <span class="input-group-text"><i class="fas fa-key"></i></span>
              </div>
              <input
                :type="mostrarSenha ? 'text' : 'password'"
                v-model="formData.password"
                name="password"
                autocomplete="new-password"
                :class="['form-control', 'input_user', { 'is-invalid': errors.password != '' }]"
                placeholder="Escolha uma senha (mín. 4)"
              />
              <div class="input-group-append" @click="mostrarSenha = !mostrarSenha" style="cursor: pointer">
                <span class="input-group-text">
                  <i :class="mostrarSenha ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
              </div>
            </div>

            <div class="d-flex justify-content-center login_container">
              <button type="submit" name="button" class="btn login_btn" :disabled="loading">
                <span v-if="loading">Cadastrando</span>
                <span v-else>Cadastrar</span>
              </button>
            </div>
          </form>
        </div>

        <div class="mt-4">
          <div class="d-flex justify-content-center links">
            Já tem conta?<i style="margin-right:5px;"></i>

            <router-link :to="{ name: 'login' }" class="ml-2"
              >Login</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <!-- login-->
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      mostrarSenha: false,
      formData: {
        name: "",
        telefone: "",
        password: "",
      },
      errors: {
        name: "",
        telefone: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions(["register"]),

    registerClient() {
      this.reset();
      this.loading = true;

      this.register(this.formData)
        .then((response) => {
          this.$vToastify.success("Cadastro realizado com sucesso", "Parabéns");
          this.$router.push({ name: "login" });
        })
        .catch((error) => {
          const errorResponse = error.response;
          console.log(errorResponse);
          if (errorResponse.status === 422) {
            this.errors = Object.assign(this.errors, errorResponse.data.errors);

            this.$vToastify.error(
              "Dados inválidos, verifique novamente ",
              "Erro"
            );

            setTimeout(() => this.reset(), 4000);
            return;
          }

          this.$vToastify.error("Falha ao Registrar", "Erro");
        })
        .finally(() => (this.loading = false));
    },
    reset() {
      this.errors = {
        name: "",
        telefone: "",
        password: "",
      };
    },
  },
};
</script>

<style>
.register-hint {
  text-align: center;
  margin-bottom: 14px;
  color: #555;
}
</style>
