import * as types from '../types';

export function getAncoCategoryObject () {
  return {
    label: '',
    type: '',
    style: ''
  };
}

const initialState = () => {
  const firstElement = getAncoCategoryObject();
  return {
    pybAnswer: '',
    categoryList: [firstElement],
    docUrl: '',
    annotationUrl: '',
    isValidForm: true
  };
};

export const state = {
  ...initialState()
};

export const getters = {
  [types.GET_ANCO_PROPS] (state) {
    return state;
  },
  [types.GET_ANCO_FORM_VALID] () {
    return { isValid: state.isValidForm };
  }
};

export const mutations = {
  [types.MUTATE_ANCO_PYB_ANSWER] (state, payload) {
    state.pybAnswer = payload;
  },
  [types.MUTATE_ANCO_ADD_LIST_ITEM] (state) {
    const newObj = getAncoCategoryObject();
    state.categoryList.push(newObj);
  },
  [types.MUTATE_ANCO_DELETE_LIST_ITEM] (state, index) {
    state.categoryList.splice(index, 1);
  },
  [types.MUTATE_ANCO_UPDATE_LIST_ITEM] (state, { category, index }) {
    state.categoryList.splice(index, 1, category);
  },
  [types.MUTATE_ANCO_DOC_URL] (state, payload) {
    state.docUrl = payload;
  },
  [types.MUTATE_ANCO_ANNOTATION_URL] (state, payload) {
    state.annotationUrl = payload;
  },
  [types.MUTATE_CLEAR_ANCO] (state) {
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
