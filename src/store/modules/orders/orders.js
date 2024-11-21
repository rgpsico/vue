import axios from 'axios';
import { TOKEN_NAME, API_VERSION } from '@/configs/api';

const state = {
  myOrders: {
    data: [],
  },
  asaasCustomerId: null, // Armazena o ID do cliente do Asaas
};

const mutations = {
  SET_ORDERS(state, orders) {
    state.myOrders = orders;
  },

  SET_ORDER(state, order) {
    state.myOrders.data = order;
  },

  SET_ASAAS_CUSTOMER_ID(state, customerId) {
    state.asaasCustomerId = customerId;
  },

  CLEAR_CART(state) {
    // Aqui deve-se implementar a lógica para limpar o carrinho após um pedido bem-sucedido
    state.myOrders.data = [];
  },
};

const actions = {
  // Buscar os pedidos do usuário
  getMyOrders({ commit }) {
    const token = localStorage.getItem(TOKEN_NAME);
    if (!token) Promise.reject();

    commit('SET_PRELOADER', true);
    commit('SET_TEXT_PRELOADER', 'Carregando os meus pedidos');

    return axios
      .get(`auth/${API_VERSION}/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => commit('SET_ORDERS', response.data))
      .finally(() => commit('SET_PRELOADER', false));
  },

  // Buscar pedido por identificador
  getOrderByIdentify({ commit }, identify) {
    commit('SET_PRELOADER', true);
    commit('SET_TEXT_PRELOADER', 'Carregando os detalhes do pedido');

    return axios
      .get(`${API_VERSION}/orders/${identify}`)
      .finally(() => commit('SET_PRELOADER', false));
  },

  // Avaliação do pedido
  evaluationOrder({ commit }, params) {
    const token = localStorage.getItem(TOKEN_NAME);
    if (!token) Promise.reject();

    return axios.post(
      `auth/${API_VERSION}/orders/${params.identify}/evaluations`,
      params,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Criar pedido para usuário não autenticado
  createOrder({ commit }, params) {
    return new Promise((resolve, reject) => {
      // Recuperar o client_id do localStorage
      const clientId = localStorage.getItem('client_id');
      
      // Adicionar o client_id ao objeto params
      if (clientId) {
        params.client_id = clientId;
      }
  
      axios
        .post(`${API_VERSION}/orders`, params)
        .then((response) => {
          commit('CLEAR_CART');
          resolve(response.data.data);
        })
        .catch((error) => {
          console.error('Erro ao criar pedido não autenticado:', error);
          reject(error);
        });
    });
  },
  

  // Criar pedido autenticado
  createOrderAuthenticated({ commit }, params) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem(TOKEN_NAME);
      if (!token) {
        reject("Token não encontrado");
        return;
      }

      axios
        .post(`auth/${API_VERSION}/orders`, params, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          commit('CLEAR_CART');
          resolve(response.data.data);
        })
        .catch((error) => {
          console.error('Erro ao criar pedido autenticado:', error);
          reject(error);
        });
    });
  },

  // Criar pagamento com cartão de crédito
  createPaymentWithCreditCard({ commit }, params) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem(TOKEN_NAME);
      if (!token) {
        reject("Token não encontrado");
        return;
      }

      axios
        .post(`auth/${API_VERSION}/orders`, params, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          commit('CLEAR_CART');
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Erro ao criar pagamento com cartão:', error);
          reject(error);
        });
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
