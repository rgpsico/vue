
// Atendente escolhido fica so na sessao da aba (sessionStorage), por loja e com validade curta:
// aparelho compartilhado nao herda o atendente de outro cliente.
const ATENDENTE_KEY = 'selected_attendant'
const ATENDENTE_TTL_MS = 4 * 60 * 60 * 1000

function restoreAtendente(company) {
    const memorizar = company.atendimento && company.atendimento.memorizar
    if (!memorizar) return null

    try {
        const saved = JSON.parse(sessionStorage.getItem(ATENDENTE_KEY) || 'null')
        const valid = saved && saved.companyUuid === company.uuid && (Date.now() - saved.savedAt) < ATENDENTE_TTL_MS
        return valid ? { identify: saved.identify, name: saved.name } : null
    } catch (e) {
        return null
    }
}

export default {
    SET_COMPANIES(state,companies) {
        state.items = companies
    },

    SET_COMPANY_SELECTED (state, company) {
           // Trocar de loja nao deve manter o desbloqueio de admin da loja anterior
           const isDifferentCompany = state.companySelected.uuid && state.companySelected.uuid !== company.uuid
           if (isDifferentCompany) {
             state.adminUnlocked = false
           }

           state.companySelected = Object.assign(state.companySelected, company)

           // Lojas sem o modulo (ou API antiga) nao mandam "atendimento": volta pro padrao desligado
           if (!company.atendimento) {
             state.companySelected.atendimento = Object.assign({}, state.companySelected.atendimento, { habilitado: false })
           }
           state.atendentes = []
           state.selectedAtendente = restoreAtendente(company)

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

    },

    SET_ADMIN_UNLOCKED (state, value) {
        state.adminUnlocked = value
    },

    // Lista vinda da API (so ativos). Se o atendente escolhido saiu da lista (desativado), descarta.
    SET_ATENDENTES (state, atendentes) {
        state.atendentes = atendentes
        const sel = state.selectedAtendente
        if (sel && !atendentes.some((a) => a.identify === sel.identify)) {
            state.selectedAtendente = null
            try { sessionStorage.removeItem(ATENDENTE_KEY) } catch (e) { /* sem storage: segue */ }
        }
    },

    SET_SELECTED_ATENDENTE (state, atendente) {
        state.selectedAtendente = atendente ? { identify: atendente.identify, name: atendente.name } : null

        try {
            const memorizar = state.companySelected.atendimento && state.companySelected.atendimento.memorizar
            if (atendente && memorizar) {
                sessionStorage.setItem(ATENDENTE_KEY, JSON.stringify({
                    companyUuid: state.companySelected.uuid,
                    identify: atendente.identify,
                    name: atendente.name,
                    savedAt: Date.now(),
                }))
            } else {
                sessionStorage.removeItem(ATENDENTE_KEY)
            }
        } catch (e) {
            // sessionStorage indisponivel - a escolha vale so na memoria
        }
    }

}