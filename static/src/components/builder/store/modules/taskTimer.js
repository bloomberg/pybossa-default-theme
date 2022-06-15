import * as types from '../types';

const initialState = () => {
  return {
    showLock: false,
    isValidForm: { isValid: true }
  };
};

export const state = initialState();

export const getters = {
  [types.GET_TASK_TIMER_PROPS] (state) {
    return state;
  },
};

export const mutations = {
  [types.MUTATE_TASK_TIMER_LOCKED] (state, payload) {
    state.showLock = payload;
  },
  [types.MUTATE_CLEAR_TASK_TIMER_FORM] (state, payload) {
    state.showLock = false;
  }
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
