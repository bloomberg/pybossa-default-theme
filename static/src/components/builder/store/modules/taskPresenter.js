import * as types from '../types';
import utils from '../../utils';

const initialState = () => {
  return {
    allowSaveWork: false,
    autoSaveSeconds: 0,
    allowAssignToUser: false
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
    [types.MUTATE_AUTO_SAVE_SECONDS] (state, payload) {
      state.autoSaveSeconds = payload;
    },
    [types.MUTATE_ALLOW_ASSIGN_TO_USER] (state, payload) {
      state.allowAssignToUser = payload;
    },
    [types.MUTATE_CLEAR_TASK_PRESENTER_FORM] (state, payload) {
      state.allowSaveWork = false;
      state.allowAssignToUser = false;
      state.autoSaveSeconds = 0;
    }
  };

  export default {
    state,
    mutations,
    actions: {},
    getters
  };
