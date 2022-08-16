import * as types from '../types';
import utils from '../../utils';

const initialState = () => {
  return {
    id: utils.uniqueID(),
    'pyb-answer': '',
    label: '',
    labelAdded: false,
    rows: '5',
    cols: '100',
    isValidForm: true,
    validations: []
  };
};

export const state = {
  ...initialState()
};

export const getters = {
  [types.GET_INPUT_TEXT_AREA_PROPS] (state) {
    const props = { ...state };
    props.validations = JSON.stringify(state.validations.map((e) => { return e.name; }));
    return props;
  },
  [types.GET_INPUT_TEXT_AREA_FORM_VALID] () {
    return { isValid: state.isValidForm }
    ;
  }
};

export const mutations = {
  [types.MUTATE_INPUT_TEXT_AREA_LABEL] (state, payload) {
    state.label = payload;
  },
  [types.MUTATE_INPUT_TEXT_AREA_LABEL_ADDED] (state, payload) {
    state.labelAdded = payload;
  },
  [types.MUTATE_INPUT_TEXT_AREA_ROWS] (state, payload) {
    state.rows = payload;
  },
  [types.MUTATE_INPUT_TEXT_AREA_COLS] (state, payload) {
    state.cols = payload;
  },
  [types.MUTATE_INPUT_TEXT_AREA_VALIDATIONS] (state, payload) {
    state.validations = payload;
  },
  [types.MUTATE_INPUT_TEXT_AREA_PYB_ANSWER] (state, payload) {
    state['pyb-answer'] = payload;
  },
  [types.MUTATE_CLEAR_INPUT_TEXT_AREA_FORM] (state) {
    const initial = initialState();
    Object.keys(initial).forEach(key => {
      state[key] = initial[key];
    });
  }
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
