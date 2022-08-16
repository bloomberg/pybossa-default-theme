/* eslint-disable no-undef */
import * as types from '../../types';

export const state = {
  inputTextArea: {
    id: '1',
    'pyb-answer': 'pybanswer',
    label: 'label',
    labelAdded: true,
    isValidForm: true
  }
};

export const getters = {
  [types.GET_INPUT_TEXT_AREA_PROPS]: jest.fn().mockReturnValue({
    id: '1',
    'pyb-answer': 'pybanswer',
    label: 'label',
    labelAdded: true
  })
};
export const mutations = {
  [types.MUTATE_INPUT_TEXT_AREA_LABEL]: jest.fn(),
  [types.MUTATE_INPUT_TEXT_AREA_LABEL_ADDED]: jest.fn(),
  [types.MUTATE_INPUT_TEXT_AREA_PYB_ANSWER]: jest.fn(),
  [types.MUTATE_CLEAR_INPUT_TEXT_AREA_FORM]: jest.fn(),
  [types.MUTATE_INPUT_TEXT_AREA_ROWS]: jest.fn(),
  [types.MUTATE_INPUT_TEXT_AREA_COLS]: jest.fn()
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
