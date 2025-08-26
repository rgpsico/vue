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
/* Container principal com efeito de vidro */
.container {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
}

/* Efeito hover suave no container */
.container:hover {
  transform: translateY(-5px);
}

/* Cabeçalho com gradiente animado */
.bg-gradient-to-r {
  background-size: 200% auto;
  animation: gradientShift 5s ease infinite;
}

/* Avatar com borda brilhante */
.relative.w-24 {
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.2);
  transition: all 0.3s ease;
}

/* Efeito hover no avatar */
.relative.w-24:hover {
  transform: scale(1.05) rotate(5deg);
  border-color: #f97316;
}

/* Estilo para informações adicionais */
.space-y-4 > p {
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(249, 115, 22, 0.05);
  transition: all 0.2s ease;
}

/* Hover nas informações */
.space-y-4 > p:hover {
  background-color: rgba(249, 115, 22, 0.1);
  transform: translateX(10px);
}

/* Estilo para títulos fortes */
p strong {
  color: #f97316;
  font-weight: 600;
  margin-right: 8px;
}

/* Botões com efeito de elevação */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

/* Efeito hover nos botões */
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Animação do gradiente */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Status online com animação de pulso */
.bg-green-400 {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* Media queries para responsividade */
@media (max-width: 640px) {
  .container {
    margin: 10px;
    padding: 15px;
  }

  .space-y-4 > p {
    padding: 8px;
  }

  button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
