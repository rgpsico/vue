import axios from 'axios'

import { TOKEN_NAME } from '@/configs/api'

export default {
    state: {
        me: {
            name: '',
            email: '',
        },
        authenticated: false,
        asaasCustomerId: null, // adiciona o campo para armazenar o ID do cliente do Asaas
    },

    mutations: {
        SET_ME(state, me) {
            state.me = me;
            state.authenticated = true;
        },

        SET_AUTHENTICATED(state, status) {
            state.authenticated = status;
        },

        LOGOUT(state) {
            state.me = {
                name: '',
                email: '',
            };
            state.authenticated = false;
            state.asaasCustomerId = null;
        },

        SET_ASAAS_CUSTOMER_ID(state, customerId) {
            state.asaasCustomerId = customerId;
        },
    },

    actions: {
        register({ commit, dispatch }, params) {
            return axios.post('auth/register', params)
                .then(() => {
                    // Após registrar, chama a action para registrar no Asaas
                   // return dispatch('registerWithAsaas', params);
                });
        },

        login({ commit, dispatch }, params) {
            return axios.post('auth/token', params)
                .then(response => {
                    const token = response.data.token;
                    localStorage.setItem(TOKEN_NAME, token);
                    dispatch('getMe');
                });
        },

        getMe({ commit }) {
            const token = localStorage.getItem(TOKEN_NAME);
            if (!token) return;

            return axios.get('auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => commit('SET_ME', response.data.data))
            .catch(error => localStorage.removeItem(TOKEN_NAME));
        },

        logout({ commit }) {
            const token = localStorage.getItem(TOKEN_NAME);
            if (!token) return;

            return axios.post('auth/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => {
                commit('LOGOUT');
                console.log('deslogou');
                localStorage.removeItem(TOKEN_NAME);
            });
        },

        // Action para cadastrar o cliente no Asaas
        registerWithAsaas({ commit }, params) {
            return axios.post('asaas/customer', {
                name: params.name,
                email: params.email,
                phone: params.phone,
                address: params.address,
                postalCode: params.postalCode,
                province: params.province,
                cpf: params.cpf, // Adiciona o campo CPF
            })
            .then(response => {
                console.log(response)
                const asaasCustomerId = response.data.id;
                commit('SET_ASAAS_CUSTOMER_ID', asaasCustomerId);
                console.log('Cliente cadastrado no Asaas com sucesso:', asaasCustomerId);
            })
            .catch(error => {
                console.error('Erro ao cadastrar cliente no Asaas:', error);
            });
        },
    },
};
