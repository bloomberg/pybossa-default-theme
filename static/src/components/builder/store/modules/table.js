import * as types from '../types';
import utils from '../../utils';

const prop = (value, isVariable) => {
  return { value, isVariable };
};
export const getColumnObject = id => {
  return {
    name: '',
    header: '',
    component: 'plain-text',
    id: `Columns ${id}`
  };
};

export const initialState = () => {
  return {
    id: prop(utils.uniqueID(), false),
    label: prop('', false),
    name: prop('', false),
    data: { ...prop('', true), list: [] },
    columns: [getColumnObject(1)],
    options: prop(
      {
        headings: {}
      },
      false
    ),
    colCounter: 1
  };
};

export const state = {
  table: {
    form: initialState()
  }
};

export const getters = {
  [types.GET_TABLE_FORM]: state => {
    return state.table.form;
  },

  [types.GET_TABLE_FORM_VALID]: state => {
    /* Determine if Table Form is valid */
    const table = state.table.form;
    const anyColumnNameEmpty =
      table.columns.filter(c => c.name === '').length > 0;
    const anyDirtyEmptyColumn =
      table.columns.filter(c => c.name === '' && c.dirty).length > 0;
    const isAnswerFieldDirty =
      (table.name.value === '' && table.isVariable) ||
      (table.name.value === '' && table.name.dirty);
    const anyDirtyColumn = table.columns.filter(c => c.dirty).length > 0;
    const isFormUntouched = !table.name.dirty && !anyDirtyColumn;
    const anyColumnComponent =
      table.columns.filter(col => col.component !== 'plain-text').length > 0;
    const repeatedColName =
      table.columns.length !==
      [...new Set(table.columns.map(c => c.name))].length;
    const isDataNameEmptyAndRequired =
      table.data.isVariable && table.data.value === '';
    const isAnswerFieldRequired = anyColumnComponent && table.name.value === '';

    if (
      isFormUntouched ||
      isDataNameEmptyAndRequired ||
      isAnswerFieldRequired ||
      anyColumnNameEmpty ||
      isAnswerFieldDirty ||
      anyDirtyEmptyColumn ||
      repeatedColName
    ) {
      return false;
    } else {
      return true;
    }
  }
};

export const mutations = {
  [types.MUTATE_TABLE_FORM]: (state, payload) => {
    state.table.form = payload;
  },
  [types.MUTATE_TABLE_COLUMNS_FORM]: (state, payload) => {
    state.table.form.columns = payload.columnns;
  }
};

export const actions = {
  [types.UPDATE_TABLE_FORM]: ({ commit }, payload) => {
    commit(types.MUTATE_TABLE_FORM, payload);
  },
  [types.CLEAR_TABLE_FORM]: ({ commit }) => {
    commit(types.MUTATE_TABLE_FORM, initialState());
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
