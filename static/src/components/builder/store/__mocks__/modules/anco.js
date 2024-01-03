import * as types from '../../types';

export const state = {
  anco: {
    'pyb-answer': 'myPybAnswer',
    categoryList: [{ name: 'category1', type: 'text', stle: 'color:red' }],
    docUrl: 'http://boomberg.next/doc.pdf',
    annotationUrl: 'http://boomberg.next/annotation.json',
    isValidForm: true
  }
};

export const getters = {
  [types.GET_TEXT_INPUT_PROPS]: jest.fn().mockReturnValue({
    id: '1',
    'pyb-answer': 'pybanswer',
    label: 'label',
    labelAdded: true
  })
};

export const mutations = {
  [types.MUTATE_ANCO_PYB_ANSWER]: jest.fn(),
  [types.MUTATE_ANCO_DOC_URL]: jest.fn(),
  [types.MUTATE_ANCO_ANNOTATION_URL]: jest.fn(),
  [types.MUTATE_ANCO_ADD_LIST_ITEM]: jest.fn()
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
