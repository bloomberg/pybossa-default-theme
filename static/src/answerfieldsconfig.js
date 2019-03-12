'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import FieldsConfig from './components/fieldsconfig/index'

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        csrf: '',
        fieldNames: [],
        answerFields: {},
        newFields: {}
    },

    getters: {
        answerFields(state) {
            const rv = {};
            state.fieldNames.forEach((name) => {
                rv[name] = state.answerFields[name];
            });
            return rv;
        },

        csrfToken(state) {
            return state.csrf;
        },

        isNewField: (state) => (name) => {
            const f = state.newFields[name] || false
            return f;
        }
    },

    mutations: {
        addField(state, payload) {
            const { name, type, config, newField=false } = payload;
            if (state.answerFields.hasOwnProperty(name)) {
                return;
            }
            if (newField) {
                state.newFields[name] = true;
            }
            Vue.set(state.answerFields, name, { type, config });
            state.fieldNames.push(name);
        },

        addFieldConfig(state, payload) {
            const { name, config } = payload;
            state.answerFields[name].config = config;
        },

        deleteField(state, payload) {
            const { name } = payload;
            const ix = state.fieldNames.indexOf(name);
            if (ix >= 0) {
                state.fieldNames.splice(ix, 1);
            }
            delete state.answerFields[name];
        },

        setData(state, payload) {
            state.csrf = payload.csrf;
            const fields = payload.answerFields;
            for (name in payload.answerFields) {
                store.commit('addField', {
                    name,
                    ...fields[name]
                });
            }
        }
    }
});

new Vue({
    el: '#answerfieldsconfig',
    store,
    components: {
        FieldsConfig
    }
});

window.answerFields = {
    setData: store.commit.bind(null, 'setData')
}
