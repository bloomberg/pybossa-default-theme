import * as types from '../types';
import utils from '../../utils';

const initialState = () => {
  return {
    allowSaveWork: true
  };
};

export const state = {
  ...initialState()
};

export const getters = {
    [types.GET_TASK_PRESENTER_PROPS] (state) {
      return state;
    }
  };

  export const mutations = {
    [types.MUTATE_ALLOW_SAVE_WORK] (state, payload) {
      state.allowSaveWork = payload;
    },
    [types.MUTATE_ALLOW_SAVE_WORK] (state, payload) {
      state.allowSaveWork = false;
    }
  };

  export default {
    state,
    mutations,
    actions: {},
    getters
  };
