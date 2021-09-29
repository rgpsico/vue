import Vue from 'vue'
import Vuex from  'vuex'


import  {state , mutations} from './default'
import companies from './modules/companies'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        companies

    },
    state,
    mutations

    

})