<template>
  <div
    class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6"
  >
    <!-- Loading -->
    <div v-if="isLoading" class="text-center p-6 text-gray-600">
      Carregando perfil...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center p-6 text-red-600">
      Erro ao carregar perfil: {{ error.message }}
      <button
        @click="fetchMe"
        class="mt-4 bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600"
      >
        Tentar novamente
      </button>
    </div>

    <!-- Perfil -->
    <div
      v-else-if="me && me.name"
      class="container mx-auto max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <!-- Header -->
      <div
        class="relative bg-gradient-to-r from-orange-600 to-amber-500 rounded-t-2xl overflow-hidden"
      >
        <div
          class="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 justify-center"
        >
          <!-- Avatar -->
          <div
            class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <img
              v-if="me.avatar"
              :src="me.avatar"
              :alt="me.name"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="text-gray-400"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
            <div
              class="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full shadow-md"
            ></div>
          </div>

          <!-- Dados -->
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
              {{ me.name }}
            </h1>
            <p class="text-amber-100 text-base sm:text-lg mb-3">
              {{ me.email }}
            </p>
            <div
              class="inline-flex items-center px-3 py-1.5 bg-white bg-opacity-20 backdrop-blur-sm rounded-full"
            >
              <div
                class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"
              ></div>
              <span class="text-white font-medium text-sm">{{
                me.role || "Cliente"
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações adicionais -->
      <div class="p-6 space-y-4">
        <p><strong>Telefone:</strong> {{ me.telefone || "Não informado" }}</p>
        <p><strong>Endereço:</strong> {{ me.endereco || "Não informado" }}</p>
        <p><strong>Instagram:</strong> {{ me.instagran || "Não informado" }}</p>
        <p><strong>Asaas Key:</strong> {{ me.asaas_key || "Não informado" }}</p>
      </div>

      <!-- Botões -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center p-6">
        <button
          @click="editProfile"
          class="group bg-white border-2 border-gray-200 hover:border-amber-500 text-gray-800 hover:text-amber-600 font-semibold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span>Editar Perfil</span>
        </button>

        <button
          @click="openWhatsApp"
          class="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span>Fale no WhatsApp</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Profile",
  data() {
    return {
      isLoading: false,
      error: null,
      me: null,
    };
  },
  methods: {
    editProfile() {
      this.$router.push({ name: "edit-profile" });
    },
    openWhatsApp() {
      if (this.me && this.me.telefone) {
        window.open(`https://wa.me/${this.me.telefone}`, "_blank");
      }
    },
    async fetchMe() {
      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        const token_sanctum = localStorage.getItem("token_sanctum");

        const response = await axios.get(
          "https://admindelivery.comunidadeppg.com.br/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token_sanctum}`,

              "X-Sanctum-Token": token_sanctum,
            },
          }
        );

        // Pega só o objeto data do cliente
        this.me = response.data.data;
        console.log("Dados do usuário:", this.me);
      } catch (error) {
        this.error = error;
        console.error("Erro ao buscar perfil:", error);

        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token_sanctum");
          this.$router.push({ name: "login" });
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchMe();
  },
};
</script>

<style scoped>
/* Container principal */
.container {
  padding: 2rem; /* aumenta o padding interno */
  background-color: rgba(
    255,
    255,
    255,
    0.95
  ); /* deixa um pouco mais branco para destacar */
}

/* Texto das informações adicionais */
p {
  font-size: 1rem;
  color: #4b5563; /* cinza escuro para melhor leitura */
  line-height: 1.6;
}

/* Títulos fortes das informações */
p strong {
  color: #f97316; /* laranja para destacar */
  font-weight: 600;
}

/* Espaçamento entre os itens das informações */
.space-y-4 > p {
  margin-bottom: 0.75rem;
}

/* Botões */
button {
  min-width: 160px; /* deixa os botões maiores e mais fáceis de clicar */
}

/* Ajuste para o header */
.relative.z-10 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

/* Avatar */
.relative.w-24 {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); /* sombra mais visível */
}

/* Pequeno destaque no hover do avatar */
.relative.w-24:hover {
  transform: scale(1.1);
}

/* Deixa o background da seção principal mais contrastante */
.min-h-screen {
  background: linear-gradient(
    to bottom right,
    #fef3c7,
    #fb923c
  ); /* amarelo + laranja suave */
}

/* Aqui você mantém suas animações, hover effects e scrollbar customizada */
</style>
