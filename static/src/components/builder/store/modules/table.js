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
        component: 'plain-text'
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
            headings: {},
        }, false)
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
        return utils.getComponentTableProps(state.table.form)
    },
    [types.GET_TABLE_FORM_VALID]: (state) => {
        const table = state.table.form

        const anyColumnNameEmpty = table.columns.filter((c) => (c.name === '')).length > 0

        const anyDirtyEmptyColumn = table.columns.filter((c) =>
            ((c.name === '' && c.dirty))).length > 0

        const isAnswerFieldDirty = table.name.value === '' && table.name.dirty

        const anyDirtyColumn = table.columns.filter((c) => (c.dirty)).length > 0

        const isFormUntouched = !table.name.dirty && !anyDirtyColumn

        if (isAnswerFieldDirty || anyDirtyEmptyColumn) {
            return false
        } else if (
            table.data.list.length > 0 && anyColumnNameEmpty) {
            return false
        } else if (isFormUntouched) {
            return false
        } else {
            return true
        }
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
    [types.UPDATE_TABLE_FORM]: ({ commit }, payload) => {
        commit(types.MUTATE_TABLE_FORM, payload)
    },
    [types.CLEAR_TABLE_FORM]: ({ commit }) => {
        commit(types.MUTATE_TABLE_FORM, initialState())
    },
    [types.UPDATE_TABLE_COLUMNS_FORM]: ({ commit, state }, payload) => {
        let inputColumns = false
        payload.columns.forEach(function (col) {
            if (col.component !== 'plain-text') {
                col.isColumnId = false
                inputColumns = true
            }
        })
        if (!inputColumns) {
            payload.name.value = ''
            payload.columns.forEach(function (col) {
                col.isColumnId = false
            })
        }

        commit(types.MUTATE_TABLE_FORM, state.table.form)
    }
}


export default {
    state,
    mutations,
    actions,
    getters
}
