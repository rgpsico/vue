
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
             } else {
               state.selectedTable = null
             }
           } catch (e) {
             state.selectedTable = null
           }
    },

    SET_SELECTED_TABLE (state, table) {
        state.selectedTable = table
        try {
          localStorage.setItem('selected_table', JSON.stringify({
            companyUuid: state.companySelected.uuid,
            table,
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