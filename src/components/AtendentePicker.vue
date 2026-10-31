<template>
  <div class="atendente-picker" v-if="enabled">
    <p class="atendente-title">
      Quem está atendendo você?
      <span v-if="config.obrigatorio" class="atendente-required">obrigatório</span>
    </p>

    <p v-if="locked" class="atendente-locked">
      <i class="fa-solid fa-user-check"></i>
      Atendido por <strong>{{ selected.name }}</strong>
    </p>

    <div v-else class="atendente-chips" role="radiogroup" aria-label="Quem está atendendo você?">
      <button
        v-for="atendente in atendentes"
        :key="atendente.identify"
        type="button"
        role="radio"
        :aria-checked="isSelected(atendente) ? 'true' : 'false'"
        class="atendente-chip"
        :class="{ active: isSelected(atendente) }"
        @click="choose(atendente)"
      >
        {{ atendente.name }}
      </button>

      <button
        v-if="config.permitir_sem_atendente"
        type="button"
        role="radio"
        :aria-checked="!selected ? 'true' : 'false'"
        class="atendente-chip atendente-chip-none"
        :class="{ active: !selected }"
        @click="choose(null)"
      >
        Ainda não tenho atendente
      </button>
    </div>

    <p v-if="!locked && atendentes.length === 0" class="atendente-empty">
      Nenhum atendente disponível no momento.
    </p>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

// Escolha do atendente: 100% controlada pelas configuracoes da empresa (company.atendimento).
// Desligado = nao renderiza nada e o cardapio funciona como sempre.
export default {
  name: "AtendentePicker",

  computed: {
    ...mapState({
      company: (state) => state.companies.companySelected,
      atendentes: (state) => state.companies.atendentes,
      selected: (state) => state.companies.selectedAtendente,
    }),

    config() {
      return this.company.atendimento || {};
    },

    enabled() {
      return !!this.config.habilitado;
    },

    // Quando a empresa nao deixa trocar, a escolha feita vira so leitura
    locked() {
      return !!this.selected && this.config.permitir_troca === false;
    },
  },

  methods: {
    ...mapMutations({
      select: "SET_SELECTED_ATENDENTE",
    }),

    isSelected(atendente) {
      return !!this.selected && this.selected.identify === atendente.identify;
    },

    choose(atendente) {
      this.select(atendente);
    },
  },
};
</script>

<style scoped>
.atendente-picker {
  margin: 12px 0;
}

.atendente-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: #2c3e50;
  margin: 0 0 8px;
}

.atendente-required {
  margin-left: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #b45309;
  background: #fef3c7;
  padding: 2px 8px;
  border-radius: 999px;
}

.atendente-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.atendente-chip {
  background: #f2f3f5;
  border: 1px solid transparent;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.9rem;
  min-height: 44px;
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.atendente-chip:hover {
  background: #e5e7eb;
}

.atendente-chip.active {
  background: #ff6b35;
  color: #fff;
}

.atendente-chip-none {
  background: #fff;
  border-color: #d1d5db;
}

.atendente-chip-none.active {
  border-color: #ff6b35;
}

.atendente-locked {
  margin: 0;
  color: #374151;
}

.atendente-empty {
  margin: 8px 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}
</style>
