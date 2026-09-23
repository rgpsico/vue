<template>
  <div class="checkout-card">
    <h2 class="checkout-card-title">Resumo do pedido</h2>

    <div class="checkout-card-row">
      <span>{{ products.length }} {{ products.length === 1 ? "item" : "itens" }}</span>
      <strong>R$ {{ totalCart }}</strong>
    </div>

    <button class="btn-finalizar" @click.prevent="openModalCheckout()">
      Finalizar pedido
    </button>

    <b-modal id="bv-modal-example" hide-footer hide-header centered content-class="checkout-modal-content">
      <div class="checkout-modal">
        <div class="checkout-modal-header">
          <h3>Finalizar pedido</h3>
          <button
            class="checkout-modal-close"
            @click="$bvModal.hide('bv-modal-example')"
            aria-label="Fechar"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="checkout-modal-body" v-if="loading">
          <div class="checkout-spinner"></div>
          <p>Gerando pedido... aguarde</p>
        </div>

        <div class="checkout-modal-body" v-else>
          <div class="checkout-summary-box">
            <span>{{ products.length }} {{ products.length === 1 ? "item" : "itens" }}</span>
            <strong>R$ {{ totalCart }}</strong>
          </div>

          <template v-if="!isGuest || adminUnlocked">
            <div class="form-group" v-if="tables.length > 0">
              <label for="tableSelect">Onde você está?</label>
              <select v-model="selectedTableIdentify" id="tableSelect" class="form-control">
                <option value="">Selecione o guarda-sol / cadeira</option>
                <option
                  v-for="table in tables"
                  :key="table.identify"
                  :value="table.identify"
                >
                  {{ table.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="comment">Comentário (opcional)</label>
              <textarea
                id="comment"
                name="comment"
                v-model="comment"
                rows="2"
                placeholder="Ex: sem cebola, capricha no gelo..."
                class="form-control"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="paymentMethod">Forma de pagamento</label>
              <select v-model="paymentMethod" id="paymentMethod" class="form-control">
                <!-- <option value="pix">Pix</option> -->
                <!-- <option value="cartao_credito">Cartão de Crédito</option> -->
                <option value="pagamento_entrega">Pagamento na Entrega</option>
              </select>
            </div>

            <!-- Campos de cartão de crédito -->
            <div v-if="paymentMethod === 'cartao_credito'" class="card-fields">
              <div class="form-group">
                <label for="cardNumber">Número do Cartão</label>
                <input
                  type="text"
                  id="cardNumber"
                  v-model="cardNumber"
                  class="form-control"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div class="form-group">
                <label for="cardHolder">Nome no Cartão</label>
                <input
                  type="text"
                  id="cardHolder"
                  v-model="cardHolder"
                  class="form-control"
                  placeholder="Nome como está no cartão"
                />
              </div>
              <div class="card-fields-row">
                <div class="form-group">
                  <label for="expiryMonth">Mês</label>
                  <input
                    type="text"
                    id="expiryMonth"
                    v-model="expiryMonth"
                    class="form-control"
                    placeholder="MM"
                  />
                </div>
                <div class="form-group">
                  <label for="expiryYear">Ano</label>
                  <input
                    type="text"
                    id="expiryYear"
                    v-model="expiryYear"
                    class="form-control"
                    placeholder="AAAA"
                  />
                </div>
                <div class="form-group">
                  <label for="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    v-model="cvv"
                    class="form-control"
                    placeholder="000"
                  />
                </div>
              </div>
            </div>

            <!-- Exibe QR Code Pix -->
            <div v-if="paymentMethod === 'pix' && qrCodeUrl" class="pix-box">
              <img :src="qrCodeUrl" alt="QR Code Pix" />
              <p>Escaneie o QR Code com o aplicativo do seu banco para pagar</p>
            </div>

            <button class="btn-confirm" @click.prevent="createOrder">
              Confirmar pedido
            </button>
          </template>

          <!-- Pedido sem login: so libera se o guarda-sol veio do QR Code
               escaneado (prova que a pessoa esta la), nunca de uma lista
               escolhida livremente - qualquer um poderia marcar o
               guarda-sol errado de proposito. -->
          <template v-else-if="guestCheckoutEnabled && selectedTableFromQr">
            <div class="form-group">
              <label>Onde você está?</label>
              <div class="checkout-locked-table">
                <i class="fa-solid fa-umbrella-beach"></i>
                {{ selectedTableName }}
              </div>
            </div>

            <div class="form-group">
              <label for="comment">Comentário (opcional)</label>
              <textarea
                id="comment"
                name="comment"
                v-model="comment"
                rows="2"
                placeholder="Ex: sem cebola, capricha no gelo..."
                class="form-control"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="paymentMethod">Forma de pagamento</label>
              <select v-model="paymentMethod" id="paymentMethod" class="form-control">
                <option value="pagamento_entrega">Pagamento na Entrega</option>
              </select>
            </div>

            <button class="btn-confirm" @click.prevent="createOrder">
              Confirmar pedido
            </button>
          </template>

          <template v-else-if="guestCheckoutEnabled">
            <div class="checkout-qr-hint">
              <i class="fa-solid fa-qrcode"></i>
              <p>
                Escaneie o QR Code do seu guarda-sol pra fazer o pedido sem
                precisar criar conta.
              </p>
            </div>

            <div class="admin-unlock">
              <button
                type="button"
                class="admin-unlock-toggle"
                @click="showAdminUnlock = !showAdminUnlock"
              >
                É da equipe da barraca? Desbloquear com a senha
              </button>

              <div v-if="showAdminUnlock" class="admin-unlock-form">
                <input
                  type="password"
                  v-model="adminPassword"
                  class="form-control"
                  placeholder="Senha do administrador"
                  @keyup.enter="unlockAsAdmin"
                />
                <p class="field-error" v-if="adminUnlockError">{{ adminUnlockError }}</p>
                <button
                  type="button"
                  class="btn-unlock"
                  :disabled="unlockingAdmin || !adminPassword"
                  @click="unlockAsAdmin"
                >
                  {{ unlockingAdmin ? "Verificando..." : "Desbloquear" }}
                </button>
              </div>
            </div>

            <router-link :to="{ name: 'login' }" class="btn-confirm">
              Fazer login
            </router-link>
            <router-link :to="{ name: 'register' }" class="btn-secondary-pill">
              Criar conta
            </router-link>
          </template>

          <template v-else>
            <p class="checkout-login-hint">
              Entre na sua conta ou cadastre-se pra finalizar o pedido.
            </p>

            <router-link :to="{ name: 'login' }" class="btn-confirm">
              Fazer login
            </router-link>
            <router-link :to="{ name: 'register' }" class="btn-secondary-pill">
              Criar conta
            </router-link>
          </template>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState({
      products: (state) => state.cart.products,
      me: (state) => state.auth.me,
      company: (state) => state.companies.companySelected,
      selectedTableFromQr: (state) => state.companies.selectedTableFromQr,
      adminUnlocked: (state) => state.companies.adminUnlocked,
    }),

    totalCart() {
      return this.products.reduce(
        (total, item) => total + item.qty * item.product.price,
        0
      );
    },

    isGuest() {
      return this.me.name === "";
    },

    // Configuravel por loja (tela Configuracoes do admin) - lojas de
    // praia deixam o cliente pedir so escolhendo o guarda-sol, sem login.
    guestCheckoutEnabled() {
      return !!this.company.guest_checkout_enabled;
    },

    selectedTableName() {
      const table = this.$store.state.companies.selectedTable;
      return table ? table.name : "";
    },

    // Compartilhado com a tela da loja - selecionar aqui ou la reflete
    // no mesmo lugar (Vuex + localStorage).
    selectedTableIdentify: {
      get() {
        const table = this.$store.state.companies.selectedTable;
        return table ? table.identify : "";
      },
      set(identify) {
        const table = this.tables.find((t) => t.identify === identify) || null;
        this.setSelectedTable(table);
      },
    },
  },

  data() {
    return {
      comment: "",
      loading: false,
      paymentMethod: "pagamento_entrega",
      qrCodeUrl: "",
      cardNumber: "",
      cardHolder: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      tables: [],
      // Desbloqueio (adminUnlocked em si vem do Vuex, compartilhado com o
      // seletor de guarda-sol da loja) pra equipe da barraca escolher o
      // guarda-sol livremente sem precisar escanear o QR Code
      showAdminUnlock: false,
      adminPassword: "",
      unlockingAdmin: false,
      adminUnlockError: "",
    };
  },

  methods: {
    ...mapActions([
      "createOrder",
      "createPaymentWithCreditCard",
      "getTablesByCompany",
      "unlockAdmin",
    ]),
    ...mapMutations({
      setSelectedTable: "SET_SELECTED_TABLE",
    }),

    async loadTables() {
      if (!this.company.uuid) return;
      try {
        this.tables = await this.getTablesByCompany(this.company.uuid);
      } catch (error) {
        this.tables = [];
      }
    },

    // Confirma a senha do admin da barraca (mesmo login do painel) - uma
    // vez desbloqueado, vale tambem pro seletor de guarda-sol no topo da
    // loja (estado compartilhado no Vuex), nao so aqui no checkout.
    unlockAsAdmin() {
      this.adminUnlockError = "";
      if (!this.adminPassword) return;

      this.unlockingAdmin = true;

      this.unlockAdmin({ email: this.company.contact, password: this.adminPassword })
        .then(() => {
          this.showAdminUnlock = false;
          this.adminPassword = "";
          this.$vToastify.success("Liberado! Escolha o guarda-sol.", "Pronto");
        })
        .catch(() => {
          this.adminUnlockError = "Senha incorreta";
        })
        .finally(() => {
          this.unlockingAdmin = false;
        });
    },

    createOrder() {
      // Pedido sem login so e permitido com guarda-sol vindo do QR Code
      // escaneado (prova presenca fisica) ou com a senha do admin
      // desbloqueando a escolha manual. Escolha manual livre sem nenhuma
      // das duas deixaria qualquer um marcar o guarda-sol errado de proposito.
      if (this.isGuest && !this.adminUnlocked && !this.selectedTableFromQr) {
        this.$vToastify.error(
          "Escaneie o QR Code do guarda-sol para continuar",
          "Erro"
        );
        return;
      }

      this.loading = true;

      const asaasKey = localStorage.getItem("asaas_key");

      let params = {
        token_company: this.company.uuid,
        asaas_key: asaasKey,
        comment: this.comment,
        payment_method: this.paymentMethod,
        value: this.totalCart,
        products: [...this.products],
        table: this.selectedTableIdentify || undefined,
      };

      if (this.paymentMethod === "pix") {
        if (!asaasKey) {
          this.$vToastify.error("Erro ao obter chave Asaas", "Erro");
          this.loading = false;
          return;
        }

        this.generatePixQrCode(params, asaasKey)
          .then((qrCodeUrl) => {
            this.qrCodeUrl = qrCodeUrl;
            this.$vToastify.success("QR Code gerado com sucesso!", "Pix");
          })
          .catch((error) => {
            console.error("Erro ao gerar QR Code Pix:", error);
            this.$vToastify.error("Erro ao gerar QR Code Pix", "Erro");
          })
          .finally(() => (this.loading = false));
      } else if (this.paymentMethod === "cartao_credito") {
        params = {
          ...params,
          creditCard: {
            holderName: this.cardHolder,
            number: this.cardNumber,
            expiryMonth: this.expiryMonth,
            expiryYear: this.expiryYear,
            ccv: this.cvv,
          },
          creditCardHolderInfo: {
            name: this.me.name,
            email: this.me.email,
          },
        };

        this.createPaymentWithCreditCard(params)
          .then((order) => {
            if (order && order.identify) {
              this.$vToastify.success(
                "Pagamento realizado com sucesso!",
                "Parabéns"
              );
              this.$router.push({
                name: "order.detail",
                params: {
                  identify: order.identify,
                },
              });
            } else {
              throw new Error("Identificador do pedido não encontrado.");
            }
          })
          .catch((error) => {
            console.error("Erro ao realizar pagamento com cartão:", error);
            this.$vToastify.error("Erro ao realizar pagamento", "Erro");
          })
          .finally(() => (this.loading = false));
      }

      if (this.paymentMethod === "pagamento_entrega") {
        this.$store
          .dispatch("createOrder", params)
          .then((order) => {
            this.$vToastify.success(
              "Pedido realizado com sucesso!",
              "Parabéns"
            );
            this.$router.push({
              name: "order.detail",
              params: {
                identify: order.identify,
              },
            });
          })
          .catch((error) => {
            console.error("Erro ao criar pedido:", error);
            this.$vToastify.error("Erro ao criar pedido", "Erro");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    async generatePixQrCode(params, asaasKey) {
      const url = "https://www.asaas.com/api/v3/payments";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: asaasKey,
        },
        body: JSON.stringify({
          customer: this.me.id,
          billingType: "PIX",
          value: params.value,
          dueDate: new Date().toISOString().split("T")[0],
          description: "Pedido no valor de R$ " + params.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar QR Code");
      }

      const data = await response.json();
      return data.pixQrCode;
    },

    openModalCheckout() {
      this.loadTables();
      this.$bvModal.show("bv-modal-example");
    },
  },
};
</script>

<style scoped>
.checkout-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 20px;
}

.checkout-card-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 14px;
}

.checkout-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #2c3e50;
  font-size: 0.95rem;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.checkout-card-row strong {
  font-size: 1.15rem;
  color: #ff6b35;
}

.btn-finalizar {
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

.btn-finalizar:hover {
  filter: brightness(1.05);
}

.checkout-modal {
  padding: 4px;
}

.checkout-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.checkout-modal-header h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0;
}

.checkout-modal-close {
  border: none;
  background: #f4f4f4;
  color: #6c757d;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-modal-close:hover {
  background: #ececec;
}

.checkout-modal-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkout-summary-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff6f2;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 18px;
  color: #2c3e50;
  font-size: 0.9rem;
}

.checkout-summary-box strong {
  color: #ff6b35;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 6px;
}

.form-control {
  width: 100%;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.9rem;
  color: #1a1a1a;
  background: #fff;
  transition: border-color 0.15s ease;
}

.form-control:focus {
  outline: none;
  border-color: #ff6b35;
}

textarea.form-control {
  resize: vertical;
}

.card-fields {
  background: #fafafa;
  border-radius: 12px;
  padding: 14px 14px 2px;
  margin-bottom: 16px;
}

.card-fields-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.pix-box {
  text-align: center;
  margin-bottom: 16px;
}

.pix-box img {
  max-width: 220px;
  margin-bottom: 8px;
}

.pix-box p {
  font-size: 0.85rem;
  color: #6c757d;
}

.btn-confirm {
  display: block;
  width: 100%;
  text-align: center;
  border: none;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 14px;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
}

.btn-secondary-pill {
  display: block;
  width: 100%;
  text-align: center;
  border: 1.5px solid #e5e5e5;
  background: #fff;
  color: #2c3e50;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 12px;
  border-radius: 999px;
  text-decoration: none;
  margin-top: 10px;
}

.checkout-login-hint {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.checkout-locked-table {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff6f2;
  border: 1.5px solid #ffcbb0;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
  color: #2c3e50;
}

.checkout-locked-table i {
  color: #ff6b35;
}

.checkout-qr-hint {
  text-align: center;
  padding: 12px 0 20px;
  color: #6c757d;
}

.checkout-qr-hint i {
  font-size: 32px;
  color: #ff6b35;
  margin-bottom: 10px;
  display: block;
}

.checkout-qr-hint p {
  font-size: 0.9rem;
  margin: 0;
}

.admin-unlock {
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.admin-unlock-toggle {
  border: none;
  background: transparent;
  color: #6c757d;
  font-size: 0.78rem;
  text-decoration: underline;
  cursor: pointer;
}

.admin-unlock-form {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-unlock {
  border: 1.5px solid #0a4d78;
  background: #fff;
  color: #0a4d78;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 10px;
  border-radius: 999px;
  cursor: pointer;
}

.btn-unlock:disabled {
  opacity: 0.6;
  cursor: default;
}

.field-error {
  color: #dc3545;
  font-size: 0.78rem;
  margin: 0;
}

.checkout-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #ffe0d1;
  border-top-color: #ff6b35;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: checkout-spin 0.8s linear infinite;
}

@keyframes checkout-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style>
.checkout-modal-content {
  border-radius: 18px;
  border: none;
  padding: 22px;
}
</style>
