const state = {
    items: {
        data: []
    },
    companySelected: {
        name: '',
        products: {
            data:[]

        },

        // Atendimento por funcionario (config da empresa). Declarado aqui pra ser reativo no Vue 2;
        // tudo desligado ate a API dizer o contrario.
        atendimento: {
            habilitado: false,
            obrigatorio: false,
            permitir_sem_atendente: false,
            memorizar: false,
            permitir_troca: true,
            exibir_no_pedido: false,
            exigir_localizacao: false
        }

    },

    categoriesCompanySelected: {
        data:[]

    },

    // Guarda-sol/cadeira selecionado pelo cliente na loja atual
    selectedTable: null,

    // true so quando o guarda-sol veio do QR Code (prova que o cliente
    // esta fisicamente ali) - usado pra travar pedido sem login numa
    // mesa que a pessoa so escolheu numa lista, sem estar la de fato
    selectedTableFromQr: false,

    // true depois que alguem confirmou a senha do admin da barraca -
    // libera trocar o guarda-sol livremente mesmo sem login/QR Code.
    // Compartilhado entre o seletor da loja e o checkout.
    adminUnlocked: false,

    // Atendentes ativos da loja atual e o escolhido pelo cliente (null = nenhum)
    atendentes: [],
    selectedAtendente: null

}

export default state