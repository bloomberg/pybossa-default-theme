import Vue from 'vue';
import Vuex from 'vuex';
import anco from './modules/anco';
import checkboxInput from './modules/checkboxInput';
import inputTextArea from './modules/inputTextArea';
import table from './modules/table';
import textInput from './modules/textInput';

Vue.use(Vuex);
export function __createMocks (
  custom = { getters: {}, mutations: {}, actions: {}, state: {} }
) {
  const mockGetters = Object.assign({}, textInput.getters, checkboxInput.getters, table.getters, inputTextArea.getters, anco.getters);
  const mockMutations = Object.assign(
    {},
    textInput.mutations,
    checkboxInput.mutations,
    table.mutations,
    inputTextArea.mutations,
    anco.mutations
  );
  const mockActions = Object.assign({}, textInput.actions, custom.actions, inputTextArea.actions);
  const mockState = Object.assign({}, textInput.state, checkboxInput.state, table.state, inputTextArea.state,anco.state);
  return {
    getters: mockGetters,
    mutations: mockMutations,
    actions: mockActions,
    state: mockState,
    store: new Vuex.Store({
      getters: mockGetters,
      mutations: mockMutations,
      actions: mockActions,
      state: mockState
    })
  };
}

export const store = __createMocks().store;
