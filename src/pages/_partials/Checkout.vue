<template>
  <div>
    <div class="cart-price text-red">
      Preço Total: <b>R$ {{ totalCart }}</b>
    </div>
    <div class="my-4">
      <a href="#" class="cart-finalizar" @click.prevent="openModalCheckout()"
        >Finalizar</a
      >
    </div>
    <b-modal id="bv-modal-example" hide-footer hide-header hide-backdrop>
      <div class="px-md-5 my-4" v-if="loading">
        <p>Gerando pedido ...(Aguarde)</p>
      </div>

      <div class="modal-container" v-else>
        <div class="px-md-5 my-4">
          <div class="col-12" v-if="me.name !== ''">
            <p>
              <strong>Total de produtos: {{ products.length }}</strong>
            </p>
            <p>
              <strong>Preço total: R$ {{ totalCart }}</strong>
            </p>
            <div class="form-group">
              <textarea
                name="comment"
                v-model="comment"
                cols="30"
                rows="2"
                placeholder="Comentário"
                class="form-control"
              ></textarea>
            </div>

            <div class="form-group my-4">
              <label for="paymentMethod"
                ><strong>Método de Pagamento:</strong></label
              >
              <select
                v-model="paymentMethod"
                id="paymentMethod"
                class="form-control"
              >
                <option value="pix">Pix</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="pagamento_entrega">Pagamento na Entrega</option>
              </select>
            </div>

            <!-- Campos de cartão de crédito -->
            <div
              v-if="paymentMethod === 'cartao_credito'"
              class="form-group my-4"
            >
              <label for="cardNumber">Número do Cartão:</label>
              <input
                type="text"
                id="cardNumber"
                v-model="cardNumber"
                class="form-control"
                placeholder="Número do Cartão"
              />
              <label for="cardHolder" class="mt-2">Nome no Cartão:</label>
              <input
                type="text"
                id="cardHolder"
                v-model="cardHolder"
                class="form-control"
                placeholder="Nome no Cartão"
              />
              <label for="expiryMonth" class="mt-2">Mês de Validade:</label>
              <input
                type="text"
                id="expiryMonth"
                v-model="expiryMonth"
                class="form-control"
                placeholder="MM"
              />
              <label for="expiryYear" class="mt-2">Ano de Validade:</label>
              <input
                type="text"
                id="expiryYear"
                v-model="expiryYear"
                class="form-control"
                placeholder="AAAA"
              />
              <label for="cvv" class="mt-2">CVV:</label>
              <input
                type="text"
                id="cvv"
                v-model="cvv"
                class="form-control"
                placeholder="CVV"
              />
            </div>

            <!-- Exibe QR Code Pix -->
            <div
              v-if="paymentMethod === 'pix' && qrCodeUrl"
              class="text-center"
            >
              <img :src="qrCodeUrl" alt="QR Code Pix" />
              <p>Escaneie o QR Code com o aplicativo do seu banco para pagar</p>
            </div>

            <button class="btn btn-success" @click.prevent="createOrder">
              Fazer Pedido
            </button>
          </div>

          <div v-else class="col-7" style="margin-left:20%;">
            <p>
              <strong>Total de produtos: {{ products.length }}</strong>
            </p>
            <p>
              <strong>Preço total: R$ {{ totalCart }}</strong>
            </p>
            <div class="form-group">
              <textarea
                name="comment"
                v-model="comment"
                cols="30"
                rows="2"
                class="form-control"
                placeholder="Comentário"
              ></textarea>
            </div>

            <div class="col-12">
              <router-link
                :to="{ name: 'login' }"
                class="btn btn-dark btn-full login"
              >
                Fazer login
              </router-link>
            </div>
            <div class="col-12">
              <router-link
                :to="{ name: 'register' }"
                class="btn btn-danger btn-full register"
                style="margin-top:10px;"
              >
                Cadastrar
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      products: (state) => state.cart.products,
      me: (state) => state.auth.me,
      company: (state) => state.companies.companySelected,
    }),

    totalCart() {
      return this.products.reduce(
        (total, item) => total + item.qty * item.product.price,
        0
      );
    },
  },

  data() {
    return {
      comment: "",
      loading: false,
      paymentMethod: "pix",
      qrCodeUrl: "",
      cardNumber: "",
      cardHolder: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    };
  },

  methods: {
    ...mapActions(["createOrder", "createPaymentWithCreditCard"]),

    createOrder() {
      this.loading = true;

      const asaasKey = localStorage.getItem("asaas_key");

      if (!asaasKey) {
        this.$vToastify.error("Erro ao obter chave Asaas", "Erro");
        this.loading = false;
        return;
      }

      let params = {
        token_company: this.company.uuid,
        asaas_key: asaasKey,
        comment: this.comment,
        payment_method: this.paymentMethod,
        value: this.totalCart,
        products: [...this.products],
      };

      if (this.paymentMethod === "pix") {
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
      this.$bvModal.show("bv-modal-example");
    },
  },
};
</script>

<style scoped>
.modal-container {
  padding: 20px;
}

.login,
.register,
textarea {
  width: 100%;
  margin-top: 10px;
}
</style>
