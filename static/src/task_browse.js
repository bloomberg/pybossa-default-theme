/* eslint-disable no-new */
'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import TaskBrowse from './components/task_browse/task_browse';
import FiltersModal from './components/task_browse/filters_modal';
import AssignWorker from './components/task_browse/assign_worker';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    filters: {},
    selectedTask: '',
    token: ''
  },

  getters: {
    getFilters (state) {
      return state.filters;
    },

    getSelectedTask (state) {
      return state.selectedTask;
    },

    getCsrfToken (state) {
      return state.token;
    }

  },

  mutations: {
    setFilters (state, filters) {
      state.filters = JSON.parse(JSON.stringify(filters));
    },

    setSelectedTask (state, taskId) {
      state.selectedTask = taskId;
    },

    setCsrfToken (state, token) {
      state.token = token;
    }
  }
});

new Vue({
  el: '#task-browse',
  store,
  components: {
    TaskBrowse,
    FiltersModal,
    AssignWorker
  }
});

window.taskBrowse = {
  setFilters: store.commit.bind(null, 'setFilters'),
  setSelectedTask: store.commit.bind(null, 'setSelectedTask'),
  setCsrfToken: store.commit.bind(null, 'setCsrfToken')
};
