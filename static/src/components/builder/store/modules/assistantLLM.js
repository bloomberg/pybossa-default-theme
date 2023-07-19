import * as types from '../types';
import utils from '../../utils';

const initialState = () => {
  return {
    id: utils.uniqueID(),
    label: '',
    labelAdded: false,
    content: '',
    contentPreview: '',
    prompt: {
      variable: '',
      static: ''
    },
    promptSourceType: 'variable',
    useStaticPromptPreview: false,
    model: 'flan-ul2',
    modelParams: '',
    pybAnswer: '',
    editable: 'none',
    isValidForm: true
  };
};

export const state = {
  ...initialState()
};

function getText (text, sourceType, useStaticPreview) {
  switch (sourceType) {
    case 'static':
      const staticText = text.static.trim();
      return { snippet: staticText, preview: staticText };
    case 'variable':
      const preview = useStaticPreview ? text.static.trim() : '';
      return { snippet: text.variable.trim(), preview };
  }
}

export const getters = {
  [types.GET_ASSISTANT_LLM_PROPS] (state) {
    return {
      id: state.id,
      label: state.label,
      labelAdded: state.labelAdded,
      prompt: getText(state.prompt, state.promptSourceType, state.useStaticPromptPreview),
      promptSourceType: state.promptSourceType,
      useStaticPromptPreview: state.useStaticPromptPreview,
      content: state.content,
      contentPreview: state.contentPreview,
      model: state.model,
      modelParams: state.modelParams,
      editable: state.editable,
      pybAnswer: state.pybAnswer
    };
  },
  [types.GET_ASSISTANT_LLM_FORM_VALID] () {
    return { isValid: state.isValidForm }
    ;
  }
};

export const mutations = {
  [types.MUTATE_ASSISTANT_LLM_LABEL] (state, payload) {
    state.label = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_LABEL_ADDED] (state, payload) {
    state.labelAdded = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_PROMPT] (state, payload) {
    state.prompt[state.promptSourceType] = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_PROMPT_SOURCE_TYPE] (state, payload) {
    state.promptSourceType = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_CONTENT] (state, payload) {
    state.content = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_CONTENT_PREVIEW] (state, payload) {
    state.contentPreview = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_MODEL] (state, payload) {
  state.model = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_MODEL_PARAMETERS] (state, payload) {
  state.modelParams = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_EDITABLE] (state, payload) {
    state.editable = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_PYB_ANSWER] (state, payload) {
    state.pybAnswer = payload;
  },
  [types.MUTATE_ASSISTANT_LLM_USE_STATIC_PROMPT_PREVIEW] (state, payload) {
    state.useStaticPromptPreview = payload;
  }
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
