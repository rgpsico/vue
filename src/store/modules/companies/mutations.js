
export default {
    SET_COMPANIES(state,companies) {
        state.items = companies
    },

    SET_COMPANY_SELECTED (state, company) {
           state.companySelected = Object.assign(state.companySelected, company)

           // Recupera o guarda-sol/cadeira salvo, mas so se for da mesma loja -
           // trocar de loja nao deve manter o local selecionado da loja anterior
           try {
             const saved = JSON.parse(localStorage.getItem('selected_table') || 'null')
             if (saved && saved.companyUuid === company.uuid) {
               state.selectedTable = saved.table
               state.selectedTableFromQr = !!saved.fromQr
             } else {
               state.selectedTable = null
               state.selectedTableFromQr = false
             }
           } catch (e) {
             state.selectedTable = null
             state.selectedTableFromQr = false
           }
    },

    // Escolha manual (badge/dropdown) - nao prova presenca fisica, entao
    // nao vale pra liberar pedido sem login (ver SET_SELECTED_TABLE_FROM_QR)
    SET_SELECTED_TABLE (state, table) {
        state.selectedTable = table
        state.selectedTableFromQr = false
        try {
          localStorage.setItem('selected_table', JSON.stringify({
            companyUuid: state.companySelected.uuid,
            table,
            fromQr: false,
          }))
        } catch (e) {
          // localStorage indisponivel - segue sem persistir
        }
    },

    // Guarda-sol veio do QR Code escaneado - unica fonte confiavel de
    // presenca fisica pra liberar pedido sem login
    SET_SELECTED_TABLE_FROM_QR (state, table) {
        state.selectedTable = table
        state.selectedTableFromQr = true
        try {
          localStorage.setItem('selected_table', JSON.stringify({
            companyUuid: state.companySelected.uuid,
            table,
            fromQr: true,
          }))
        } catch (e) {
          // localStorage indisponivel - segue sem persistir
        }
    },

    SET_CATEGORIES_COMPANY (state, categories) {
        state.categoriesCompanySelected = categories

    },

    SET_PRODUCTS_COMPANY (state, products) {
        state.companySelected.products = products

    }

}