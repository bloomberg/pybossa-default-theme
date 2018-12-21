/* eslint-disable no-new */


import Vue from 'vue'
import Vuex from 'vuex'
import TaskBrowse from './components/task_browse/task_browse'
import FiltersModal from './components/task_browse/filters_modal'

Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        filters: {}
    },

    getters: {
        getFilters (state) {
            return state.filters
        }
    },

    mutations: {
        setFilters (state, filters) {
            state.filters = JSON.parse(JSON.stringify(filters))
        }
    }
})

new Vue({
    el: '#task-browse',
    store,
    components: {
        TaskBrowse,
        FiltersModal
    }
})

window.taskBrowse = {
    setFilters: store.commit.bind(null, 'setFilters')
}
