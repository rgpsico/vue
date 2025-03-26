<template>
  <div>
    <div class="row my-4 mx-0 details">
      <!-- Detalhes do Pedido -->
      <div class="col-12 mb-2">
        <h1 class="title-tenant h2">
          Detalhes do Pedido: <strong>{{ identify }}</strong>
        </h1>
      </div>
      <div class="col-sm-6">
        <ul class="p-0">
          <li><b>Número:</b> {{ identify }}</li>
          <li><b>Total:</b> R$ {{ order.total }}</li>
          <li><b>Data:</b> {{ formatDate(order.date) }}</li>
          <li>
            <b>Status:</b>
            <span class="badge bg-success text-light p-2">{{
              order.status
            }}</span>
          </li>
        </ul>
      </div>
      <div class="col-sm-6">
        <ul class="p-0">
          <li>
            <span>Cliente</span>
            <ul class="p-0" v-if="order.client.name">
              <li><b>Nome:</b> {{ order.client.name }}</li>
              <li><b>E-mail:</b> {{ order.client.email }}</li>
              <li
                class="mt-3"
                id="codigo_entregador"
                v-if="order.eEntregador == 1"
              >
                <div class="alert alert-warning text-center p-3">
                  <b class="d-block">
                    🚀 Código do Entregador: {{ order.eEntregador }}
                  </b>
                  <span class="fs-4 text-danger fw-bold">
                    {{ order.codigo_entrega }}
                  </span>
                  <p class="mt-2">
                    Por favor, entregue este código ao entregador no momento da
                    entrega.
                  </p>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <hr />

    <!-- Produtos do Pedido -->
    <div class="row my-4">
      <div class="col-12">
        <h4>Produtos</h4>
      </div>
      <div
        class="col-12 col-md-6 col-lg-4 my-1"
        v-for="(product, index) in order.products"
        :key="index"
      >
        <div class="details-card">
          <a href="">
            <img
              class="card-img-top"
              :src="product.image"
              :alt="product.title"
            />
          </a>
          <div class="details-card-body">
            <h5>{{ product.title }}</h5>
            <p>
              <b>R$: {{ product.price }}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
    <hr />

    <!-- Botão Avaliar Pedido -->
    <button
      class="btn btn-success col-md-2"
      v-if="
        me.name != '' &&
          me.name === order.client.name &&
          order.evaluations &&
          order.evaluations.length == 0
      "
      @click.prevent="$bvModal.show('modal-avalition')"
    >
      Avaliar o Pedido
    </button>

    <!-- Modal de Avaliação do Pedido -->
    <b-modal
      id="modal-avalition"
      name="evaluation-order"
      hide-footer
      hide-header
      hide-backdrop
    >
      <div class="px-md-5 my-4">
        <h1>Avaliar o pedido {{ identify }}</h1>
        <strong>Nota:</strong>
        <vue-stars
          name="evaluation"
          :active-color="'#ffdd00'"
          :inactive-color="'#999999'"
          :shadow-color="'#ffff00'"
          :hover-color="'#dddd00'"
          :max="5"
          :value="3"
          :readonly="false"
          :char="'★'"
          :inactive-char="''"
          :class="''"
          v-model="evaluation.stars"
        />
        <div class="form-group">
          <textarea
            v-model="evaluation.comment"
            name="comment"
            cols="30"
            rows="3"
            placeholder="comentário"
            class="form-control"
          ></textarea>
        </div>
        <button
          class="btn btn-info my-3"
          @click.prevent="sendEvaluation"
          :disabled="loadSendEvaluation"
        >
          <span v-if="loadSendEvaluation">Enviando...</span>
          <span v-else>Avaliar</span>
        </button>
      </div>
    </b-modal>

    <!-- Seção de Conversa com o Entregador -->
    <!-- <div class="row my-4">
      <div class="col-12">
        <h4>Conversa com o Entregador</h4>
        <div class="chat-box">
          <div
            class="messages"
            v-for="(message, index) in chatMessages"
            :key="index"
          >
            <div
              class="message"
              :class="{
                'from-client': message.sender === 'client',
                'from-delivery': message.sender === 'delivery',
              }"
            >
              <p>
                <strong
                  >{{
                    message.sender === "client" ? "Você" : "Entregador"
                  }}:</strong
                >
                {{ message.text }}
              </p>
            </div>
          </div>
        </div>
        <div class="input-group my-3">
          <input
            type="text"
            class="form-control"
            v-model="newMessage"
            placeholder="Digite uma mensagem..."
          />
          <button class="btn btn-primary" @click="sendMessage">Enviar</button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script src="https://cdn.socket.io/4.5.0/socket.io.min.js"></script>
<script>
import { mapActions, mapState } from "vuex";

export default {
  props: ["identify"],

  computed: {
    ...mapState({
      me: (state) => state.auth.me,
    }),
  },

  data() {
    return {
      socket: false,
      order: {
        identify: "",
        date: "",
        status: "",
        total: "",
        eEntregador: "",
        client: {
          name: "",
          email: "",
        },
        company: {
          name: "",
          image: "",
        },
        products: [],
        evaluations: [],
      },
      evaluation: {
        stars: 1,
        comment: "",
      },
      loadSendEvaluation: false,
      chatMessages: [],
      newMessage: "",
    };
  },

  mounted() {
    this.getOrderByIdentify(this.identify)
      .then(
        (response) =>
          (this.order = Object.assign(this.order, response.data.data))
      )
      .catch((error) => {
        this.$vToastify.error("Falha ao carregar detalhes do pedido", "Erro");
        this.$router.push({ name: "home" });
      });

    // Certifique-se de conectar ao Socket.IO apenas depois que o Vue estiver montado.
    this.connectSocket();
  },

  methods: {
    ...mapActions(["getOrderByIdentify", "evaluationOrder"]),

    connectSocket() {
      // Verificar se o `window.io` está disponível e usá-lo.

      // Utilize `window.io` para garantir que estamos usando o `io` do escopo global.
      this.$socket.on("connect", () => {
        console.log("Conectado ao servidor Socket.IO.");
      });

      // Receber mensagens do servidor

      console.log(this.order.identify);
      // Receber mensagens específicas do entregador
      this.$socket.on("enviarpedidoentregadores", (data) => {
        console.log("Mensagem Recebida:", data);
        this.chatMessages.push({
          sender: "delivery",
          text: data.texto,
        });
      });

      this.$socket.on("disconnect", () => {
        console.log("Desconectado do servidor Socket.IO.");
      });
    },

    sendEvaluation() {
      this.loadSendEvaluation = true;

      const params = {
        identify: this.identify,
        ...this.evaluation,
      };

      this.evaluationOrder(params)
        .then((response) => {
          this.$vToastify.success("Avaliação enviada com sucesso", "Parabéns");
          this.order.evaluations.push(response.data.data);
          this.closeModalEvaluation();
          this.$bvModal.hide("modal-avalition");
        })
        .catch((_) => this.$vToastify.error("Falha ao Avaliar", "Erro"))
        .finally(() => (this.loadSendEvaluation = false));
    },

    sendMessage() {
      if (this.newMessage.trim() === "") return;
      console.log(this.order.identify);
      const message = {
        sender: "client",
        text: this.newMessage,
        orderId: this.identify,
      };

      // Emitir a mensagem para o servidor Socket.IO.
      this.$socket.on("connect", () => {
        console.log("Conectado ao servidor Socket.IO.");
      });

      //  this.$socket.emit("receberMensagemEntregador4", message);
      this.enviarMensagem();
      // Adicionar mensagem localmente para exibir no chat.
      this.chatMessages.push(message);
      this.newMessage = "";
    },

    formatDate(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    enviarMensagem() {
      const url = "http://127.0.0.1:8000/api/batepapo/enviarmensagem";

      // Dados que serão enviados no POST
      const payload = {
        user_id: this.identify,
        mensagem: "mensagem",
      };

      // Fazendo a requisição POST
      axios
        .post(url, payload)
        .then((response) => {
          // Lida com a resposta positiva da requisição
          console.log("Pedido enviado com sucesso:", response.data);
          // Aqui você pode adicionar qualquer ação adicional, como notificações
        })
        .catch((error) => {
          // Lida com erros
          console.error("Erro ao enviar pedido:", error);
          // Aqui você pode mostrar um aviso ao usuário, se necessário
        });
    },
    closeModalEvaluation() {
      this.$bvModal.hide("modal-avalition");
    },
  },
};
</script>

<style scoped>
.chat-box {
  border: 1px solid #ccc;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}
.message {
  margin-bottom: 10px;
}
.from-client {
  text-align: right;
}
.from-delivery {
  text-align: left;
}
</style>
