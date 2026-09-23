const state = {
    items: {
        data: []
    },
    companySelected: {
        name: '',
        products: {
            data:[]

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
    adminUnlocked: false

}

export default state