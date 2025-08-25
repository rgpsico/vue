<template>
  <div
    class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6"
  >
    <!-- Exibir mensagem de carregamento -->
    <div v-if="isLoading" class="text-center p-6 text-gray-600">
      Carregando perfil...
    </div>
    <!-- Exibir mensagem de erro -->
    <div v-else-if="error" class="text-center p-6 text-red-600">
      Erro ao carregar perfil: {{ error.message }}
      <button
        @click="retry"
        class="mt-4 bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600"
      >
        Tentar novamente
      </button>
    </div>
    <!-- Renderizar conteúdo apenas quando me estiver definido -->
    <div
      v-else-if="me && me.name"
      class="container mx-auto max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <!-- Header com Background -->
      <div
        class="relative bg-gradient-to-r from-orange-600 to-amber-500 rounded-t-2xl overflow-hidden"
      >
        <div class="absolute inset-0 bg-black bg-opacity-5">
          <div
            class="absolute -top-6 -right-6 w-40 h-40 bg-white bg-opacity-10 rounded-full animate-pulse"
          ></div>
          <div
            class="absolute top-12 right-20 w-20 h-20 bg-white bg-opacity-5 rounded-full"
          ></div>
          <div
            class="absolute bottom-6 left-12 w-32 h-32 bg-white bg-opacity-5 rounded-full"
          ></div>
        </div>

        <div class="relative z-10 p-6 sm:p-8">
          <div
            class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 justify-center"
          >
            <!-- Avatar com anel animado -->
            <div class="relative">
              <div
                class="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-pulse"
              ></div>
              <div
                class="relative w-24 anuncios h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg transform hover:scale-105 transition-transform duration-300"
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
              </div>
              <div
                class="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full shadow-md"
              ></div>
            </div>

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
      </div>

      <!-- Informações da Empresa -->
      <div v-if="me.company" class="p-6">
        <div
          class="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border-b border-gray-100 mb-6"
        >
          <h2
            class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center"
          >
            <div
              class="w-7 h-7 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg mr-2 flex items-center justify-center"
            >
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path
                  d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
                />
              </svg>
            </div>
            Informações do Restaurante
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-6">
            <div class="group">
              <h3
                class="text-lg font-semibold text-gray-800 flex items-center justify-center"
              >
                <div
                  class="w-5 h-5 bg-orange-100 rounded-full mr-2 flex items-center justify-center group-hover:bg-orange-200 transition-colors"
                >
                  <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                </div>
                {{ me.company.name || "Restaurante sem nome" }}
              </h3>
              <p class="text-gray-600 text-sm text-center">
                {{ me.company.description || "Sem descrição disponível" }}
              </p>
            </div>

            <div
              class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center space-x-1 mb-1">
                    <span v-for="star in 5" :key="star" class="text-lg">
                      {{
                        star <= Math.floor(me.company.rating || 0) ? "⭐" : "☆"
                      }}
                    </span>
                    <span class="text-base font-bold text-gray-800 ml-2">{{
                      me.company.rating || "N/A"
                    }}</span>
                  </div>
                  <p class="text-xs text-gray-600">
                    {{ me.company.reviews || 0 }} avaliações
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold text-amber-600">
                    {{ me.company.rating || "N/A" }}
                  </div>
                  <div class="text-xs text-gray-500">de 5.0</div>
                </div>
              </div>
            </div>

            <div
              class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between mb-2">
                <div
                  class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="text-indigo-600"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <h4 class="font-semibold text-gray-800 text-sm mb-1">Endereço</h4>
              <p class="text-indigo-700 text-sm font-medium">
                {{ me.company.address || "Endereço não informado" }}
              </p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between mb-2">
                  <div
                    class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="currentColor"
                      class="text-green-600"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      />
                    </svg>
                  </div>
                </div>
                <h4 class="font-semibold text-gray-800 text-sm mb-1">
                  Tempo de Entrega
                </h4>
                <p class="text-green-700 text-sm font-medium">
                  {{ me.company.delivery_time || "Não informado" }}
                </p>
              </div>

              <div
                class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between mb-2">
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="currentColor"
                      class="text-blue-600"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <h4 class="font-semibold text-gray-800 text-sm mb-1">
                  Taxa de Entrega
                </h4>
                <p class="text-blue-700 text-sm font-medium">
                  R$
                  {{
                    me.company.delivery_price
                      ? me.company.delivery_price.toFixed(2).replace(".", ",")
                      : "Não informado"
                  }}
                </p>
              </div>
            </div>

            <div class="mt-4">
              <a
                v-if="me.company.whatsapp"
                :href="`https://wa.me/${me.company.whatsapp}`"
                target="_blank"
                class="group w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  class="group-hover:rotate-12 transition-transform"
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.51 3.756"
                  />
                </svg>
                <span>Fale no WhatsApp</span>
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  class="group-hover:translate-x-1 transition-transform"
                >
                  <path
                    d="m13 3 3.293 3.293-6.586 6.586 1.414 1.414 6.586-6.586L21 11V3z"
                  />
                  <path
                    d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z"
                  />
                </svg>
              </a>
              <p v-else class="text-gray-600 text-sm">
                Número de WhatsApp não informado
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center p-6">
        <button
          @click="editProfile"
          class="group bg-white border-2 border-gray-200 hover:border-amber-500 text-gray-800 hover:text-amber-600 font-semibold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <svg
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="group-hover:rotate-12 transition-transform"
          >
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
          </svg>
          <span>Editar Perfil</span>
        </button>

        <button
          class="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <svg
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="group-hover:scale-110 transition-transform"
          >
            <path
              d="M12 2.1L13.09 8.26L20 9L13.09 9.74L12 15.9L10.91 9.74L4 9L10.91 8.26L12 2.1Z"
            />
          </svg>
          <span>Compartilhar</span>
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
      me: null, // vamos guardar os dados aqui
    };
  },
  methods: {
    editProfile() {
      this.$router.push({ name: "edit-profile" });
    },
    openWhatsApp() {
      if (this.me && this.me.company && this.me.company.whatsapp) {
        window.open(`https://wa.me/${this.me.company.whatsapp}`, "_blank");
      }
    },
    async fetchMe() {
      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        const token_sanctum = localStorage.getItem("token_sanctum");

        console.log("Token:", token);
        console.log("Token Sanctum:", token_sanctum);

        const response = await axios.get(
          "https://admindelivery.comunidadeppg.com.br/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token_sanctum}`,
              "X-Sanctum-Token": token_sanctum, // se necessário pelo backend
            },
          }
        );

        this.me = response.data.data; // pega só o objeto 'data'
        console.log("Dados do usuário:", this.me);
      } catch (error) {
        this.error = error;
        console.error("Erro ao buscar perfil:", error);

        if (error.response && error.response.status === 401) {
          // logout se token inválido
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
/* Animações customizadas */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.min-h-screen {
  margin: 10%;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

/* Efeitos de hover suaves */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.1);
}

/* Scrollbar customizada */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #f59e0b, #f97316);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #d97706, #ea580c);
}
</style>
