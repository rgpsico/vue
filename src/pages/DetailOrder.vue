<template>
  <div>
    <div class="row my-4 mx-0 details">
      <div class="col-12 mb-2">
        <h1 class="title-tenant h2">
          Detalhes do Pedido <strong>{{ identify }}</strong>
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
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!-- details order -->

    <hr />

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
            <img class="card-img-top" :src="product.image" :alt="product.title"
          /></a>

          <div class="details-card-body">
            <h5>{{ product.title }}</h5>
            <p>
              <b>R$: {{ product.price }}</b>
            </p>
          </div>
        </div>
      </div>

      <hr />
      <button
        class="btn btn-success col-md-2"
        @v-if="
          me.name != '' &&
            me.name === order.client.name &&
            order.evaluation.length == 0
        "
        @click.prevent="$bvModal.show('modal-avalition')"
      >
        Avaliar o Pedido
      </button>

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
              id=""
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

      <div class="evaluations-order col-12" v-if="order.evaluations.length">
        <div v-for="(evaluation, index) in order.evaluations" :key="index">
          <p><strong>Nome:</strong> {{ evaluation.client.name }}</p>
          <p><strong>Comentário::</strong> {{ evaluation.comment }}</p>
          <p>
            <strong>Nota</strong>
            <vue-stars
              name="evaluation-user"
              :active-color="'#ffdd00'"
              :inactive-color="'#999999'"
              :shadow-color="'#ffff00'"
              :hover-color="'#dddd00'"
              :max="5"
              :readonly="true"
              :char="'★'"
              :inactive-char="''"
              :class="''"
              :value="evaluation.stars"
            />
          </p>
        </div>
      </div>
    </div>
    <!-- products order -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  props: ["identify"],

  computed: {
    ...mapState({
      me: (state) => state.auth.me,
    }),
  },

  created() {
    this.getOrderByIdentify(this.identify)
      .then(
        (response) =>
          (this.order = Object.assign(this.order, response.data.data))
      )
      .catch((error) => {
        this.$vToastify.error("Falha carregar detalhes do pedido", "Erro");
        this.$router.push({ name: "home" });
      });
  },

  data() {
    return {
      order: {
        identify: "",
        date: "",
        status: "",
        total: "",
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
        star: 1,
        comment: "",
      },
      loadSendEvaluation: false,
    };
  },

  methods: {
    ...mapActions(["getOrderByIdentify", "evaluationOrder"]),

    openModalEvaluation() {
      this.$modal.show("evaluation-order");
    },

    closeModalEvaluation() {
      this.$modal.hide("evaluation-order");
    },
    formatDate(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    sendEvaluation() {
      this.loadSendEvaluation = true;

      const params = {
        identify: this.identify,
        ...this.evaluation,
      };

      this.evaluationOrder(params)
        .then((response) => {
          this.$vToastify.success("Avaliação enviada com successo", "Parabéns");
          this.order.evaluations.push(response.data.data);
          this.closeModalEvaluation();
          this.$bvModal.hide("modal-avalition");
        })
        .catch((_) => this.$vToastify.error("Falha ao Avaliar", "Erro"))
        .finally(() => (this.loadSendEvaluation = false));
    },
  },
};
</script>
