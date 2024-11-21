import axios from 'axios'
import { TOKEN_NAME } from '@/configs/api'

export default {
    state: {
        me: {
            name: '',
            email: '',
        },
        authenticated: false,
        asaasCustomerId: null, // Armazena o ID do cliente do Asaas
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
                    // Após registrar, autentica o usuário automaticamente
                    const loginParams = {
                        email: params.email,
                        password: params.password,
                        device_name: 'web', // Inclui o device_name para o login
                    };
                    return dispatch('login', loginParams);
                })
                .catch(error => {
                    // Exibe o erro adequadamente
                    if (error.response && error.response.status === 422) {
                        console.error('Erro ao registrar:', error.response.data.errors);
                    } else {
                        console.error('Erro ao registrar:', error.message);
                    }
                    throw error; // Lança o erro para que possa ser tratado pela interface do usuário
                });
        },

        login({ commit, dispatch }, params) {
            return axios.post('auth/token', params)
                .then(response => {
                    const token = response.data.token;
                    localStorage.setItem(TOKEN_NAME, token);
                    return dispatch('getMe').then(() => {
                          window.location.href = '/';
                    });
                })
                .catch(error => {
                    // Exibe o erro adequadamente
                    if (error.response && error.response.status === 422) {
                        console.error('Erro ao fazer login:', error.response.data.errors);
                    } else {
                        console.error('Erro ao fazer login:', error.message);
                    }
                    throw error; // Lança o erro para que possa ser tratado pela interface do usuário
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
            .then(response => {
                commit('SET_ME', response.data.data);
              console.log(response)
                if (response.data.data.asaas_key) {
                    localStorage.setItem('asaas_key', response.data.data.asaas_key);
                }

                if (response.data.data.client_id) {
                    localStorage.setItem('client_id', response.data.data.client_id);
                }
            })
            .catch(error => {
                console.error('Erro ao obter informações do usuário:', error);
                localStorage.removeItem(TOKEN_NAME);
            });
        },

        logout({ commit }) {
            const token = localStorage.getItem(TOKEN_NAME);
            if (!token) return;

            return axios.post('auth/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(() => {
                commit('LOGOUT');
                console.log('Deslogou');
                localStorage.removeItem(TOKEN_NAME);
                localStorage.removeItem('asaas_key'); // Remove o asaas_key do localStorage ao fazer logout
                // Redireciona para a página de login após o logout
                window.location.href = '/login';
            })
            .catch(error => {
                console.error('Erro ao fazer logout:', error);
            });
        },

        // Action para cadastrar o cliente no Asaas
        registerWithAsaas({ commit, dispatch }, params) {
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
                const asaasCustomerId = response.data.id;
                commit('SET_ASAAS_CUSTOMER_ID', asaasCustomerId);
                localStorage.setItem('asaas_key', asaasCustomerId); // Salva o asaas_key no localStorage
                
                // Chama a action de update usando dispatch e passando email e asaasCustomerId
                dispatch('updateAsaasKeyByEmail', { email: params.email, asaasKey: asaasCustomerId });
                
                console.log('Cliente cadastrado no Asaas com sucesso:', asaasCustomerId);
            })
            .catch(error => {
                console.error('Erro ao cadastrar cliente no Asaas:', error);
                throw error; // Lança o erro para que possa ser tratado pela interface do usuário
            });
        },

        // Action para atualizar o asaas_key com base no email
        updateAsaasKeyByEmail({ commit }, { email, asaasKey }) {
            return axios.put('asaas/update-asaas-key', { email, asaas_key: asaasKey })
                .then(() => {
                    console.log('Asaas key atualizado com sucesso para o email:', email);
                })
                .catch(error => {
                    console.error('Erro ao atualizar asaas key:', error);
                });
        },
    },
};
