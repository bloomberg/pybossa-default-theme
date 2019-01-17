import Vue from 'vue'
import Vuex from 'vuex'
import textInput from './modules/textInput'
import checkboxInput from './modules/checkboxInput'
import table from './modules/table'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    getters,
    mutations,
    actions,
    modules: {
        checkboxInput,
        textInput,
        table }
})
