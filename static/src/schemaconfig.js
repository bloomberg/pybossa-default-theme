'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import FieldsConfig from './components/fieldsconfig/index';
import SchemaSetting from './components/setting/schema_setting';

Vue.use(Vuex);

// Simple store for schema configuration
const store = new Vuex.Store({
  state: {
    csrf: '',
    task_info_schema: '',
    task_answer_schema: '',
    strict_validation: false
  },
  getters: {
    csrfToken: state => state.csrf,
    taskInfoSchema: state => state.task_info_schema,
    taskAnswerSchema: state => state.task_answer_schema,
    strictValidation: state => state.strict_validation
  },
  mutations: {
    setData(state, data) {
      if (data.csrf) {
        state.csrf = data.csrf;
      }
      if (data.task_info_schema !== undefined) {
        state.task_info_schema = data.task_info_schema;
      }
      if (data.task_answer_schema !== undefined) {
        state.task_answer_schema = data.task_answer_schema;
      }
      if (data.strict_validation !== undefined) {
        state.strict_validation = data.strict_validation;
      }
    },
    updateTaskInfoSchema(state, schema) {
      state.task_info_schema = schema;
    },
    updateTaskAnswerSchema(state, schema) {
      state.task_answer_schema = schema;
    },
    updateStrictValidation(state, value) {
      state.strict_validation = value;
    }
  }
});

const app = new Vue({
  el: '#schemaconfig',
  store,
  components: {
    FieldsConfig,
    SchemaSetting
  }
});

window.answerFields = {
  setData: store.commit.bind(null, 'setData')
};

export default app;
