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
                id=""
                cols="30"
                rows="2"
                placeholder="Comentario"
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
                id=""
                cols="30"
                rows="2"
                class="form-control"
                placeholder="Comentario"
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
            <div class="col-12 my-4">
              <button
                class="btn btn-success btn-full"
                @click.prevent="createOrder"
                v-if="me.name !== ''"
              >
                Fazer Pedido
              </button>
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
      let total = 0;

      this.products.forEach((itemCart) => {
        total += itemCart.qty * itemCart.product.price;
      });
      return total;
    },
  },

  data() {
    return {
      comment: "",
      loading: false,
      paymentMethod: "pix", // Método de pagamento padrão
      // Valores fictícios para o cartão de crédito
      cardNumber: "4000000000000010",
      cardHolder: "roger neves",
      expiryMonth: "10",
      expiryYear: "2025",
      cvv: "1234",
    };
  },

  methods: {
    ...mapActions(["createOrder", "createPaymentWithCreditCard"]),

    createOrder() {
      this.loading = true;

      // Recupera a asaas_key do localStorage
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
        value: this.totalCart, // Incluindo valor total
        products: [...this.products],
      };

      if (this.paymentMethod === "cartao_credito") {
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
            cpfCnpj: "", // Adicione o CPF do cliente, caso tenha
            postalCode: "", // Adicione o CEP do cliente, caso tenha
            addressNumber: "", // Adicione o número do endereço do cliente, caso tenha
            phone: "", // Adicione o telefone do cliente, caso tenha
            mobilePhone: "", // Adicione o celular do cliente, caso tenha
          },
        };

        // Chama a action de criar pagamento com cartão de crédito
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
      } else {
        // Fluxo padrão para Pix ou pagamento na entrega
        const action =
          this.me.name === "" ? "createOrder" : "createOrderAuthenticated";

        this.$store
          .dispatch(action, params)
          .then((order) => {
            if (order && order.identify) {
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
            } else {
              throw new Error("Identificador do pedido não encontrado.");
            }
          })
          .catch((error) => {
            console.error("Erro ao realizar pedido:", error);
            this.$vToastify.error("Pedido não pode ser realizado", "Erro");
          })
          .finally(() => (this.loading = false));
      }
    },

    openModalCheckout() {
      this.$bvModal.show("bv-modal-example");
    },

    closeModalCheckout() {
      this.$bvModal.hide("bv-modal-example");
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 300px) {
  body {
    background-color: lightgreen;
  }

  .modal-container {
    width: 100%;
  }

  .login {
    width: 90%;
    text-transform: capitalize;
    margin-top: 10px;
  }

  .register {
    width: 90%;
    text-transform: capitalize;
    margin-top: 10px;
  }

  textarea {
    width: 90%;
  }
}

@media screen and (min-width: 512px) {
  .modal-container {
    width: 100%;
    margin-left: 50px;
  }
}

@media screen and (min-width: 800px) {
  .modal-container {
    width: 100%;
    padding: 20px;
    margin-left: 0;
  }
}
</style>
