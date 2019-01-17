import * as types from '../types'
import utils from '../../utils'

const prop = (value, isVariable) => {
    return { value,
        isVariable }
}
export const getColumnObject = () => {
    return {
        name: '',
        header: '',
        component: 'plain-text',
        filterable: false,
        sortable: false,
        isColumnId: false,
        hideColumnId: false
    }
}

export const initialState = () => {
    return {
        'id': prop(utils.uniqueID(), false),
        'label': prop('', false),
        'name': prop('', false),
        'data': {...prop('', true), list: []},
        'columns': [getColumnObject()],
        'options': prop({
            filterByColumn: true,
            headings: { },
            sortable: [],
            filterable: []
        }, false),
        'isValidForm': true

    }
}

export const state = {
    table: {
        form: initialState()
    }
}

export const getters = {
    [types.GET_TABLE_FORM]: (state) => {
        return state.table.form
    },
    [types.GET_TABLE_SNIPPET]: (state) => {
        return utils.getComponentCode(state.table.form, 'TABLE')
    },
    [types.GET_TABLE_FORM_VALID]: (state) => {
        const table = state.table.form
        if (((table.name.value === '' && table.name.dirty) ||
            table.columns.filter((c) => ((c.name === '' && c.dirty))).length > 0)) {
            table.isValidForm = false
        } else if (((table.name.value !== '') &&
        table.columns.filter((c) => (c.name === '')).length > 0)) {
            table.isValidForm = false
        } else if (
            table.data.list.length > 0 &&
                table.columns.filter((c) => (c.name === '')).length > 0) {
            table.isValidForm = false
        } else if (table.columns.filter(
            (col) => col.component !== 'plain-text').length > 0) {
            table.isValidForm = table.columns.filter((col) => col.isColumnId).length === 1
        } else if (table.name.value === '') {
            table.isValidForm = false
        } else {
            table.isValidForm = true
        }
        if (!table.isValidForm) {
            table.name.dirty = table.name.value === ''
            table.columns.forEach((c) => { c.dirty = (c.name === '') })
            table.data.dirty = table.data.value === '' && table.data.isVariable
        }
        return table.isValidForm
    }
}

export const mutations = {
    [types.MUTATE_TABLE_FORM]: (state, payload) => {
        state.table.form = payload
    },
    [types.MUTATE_TABLE_COLUMNS_FORM]: (state, payload) => {
        state.table.form.columns = payload.columnns
    }
}

export const actions = {
    [types.UPDATE_TABLE_FORM]: ({ commit, state }, payload) => {
        commit(types.MUTATE_TABLE_FORM, payload)
    },
    [types.CLEAR_TABLE_FORM]: ({ commit }) => {
        commit(types.MUTATE_TABLE_FORM, initialState())
    },
    [types.UPDATE_TABLE_COLUMNS_FORM]: ({ commit, state }, payload) => {
        payload.columns.forEach(function (col) {
            if (col.component !== 'plain-text') {
                col.isColumnId = false
            }
        })
        commit(types.MUTATE_TABLE_FORM, state.table.form)
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
