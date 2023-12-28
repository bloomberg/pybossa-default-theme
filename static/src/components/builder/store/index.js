import Vue from 'vue';
import Vuex from 'vuex';
import anco from './modules/anco';
import assistantLLM from './modules/assistantLLM';
import checkboxInput from './modules/checkboxInput';
import conditionalDisplay from './modules/conditionalDisplay';
import dropdownInput from './modules/dropdownInput';
import fileUpload from './modules/fileUpload';
import inputTextArea from './modules/inputTextArea';
import multiselectInput from './modules/multiselectInput';
import radioInput from './modules/radioInput';
import table from './modules/table';
import taskPresenter from './modules/taskPresenter';
import taskTimer from './modules/taskTimer';
import textInput from './modules/textInput';
import textTagging from './modules/textTagging';

import { getStoreOptions, setNamespace } from '@dtwebservices/task-presenter-components';

Vue.use(Vuex);

const TASK_PRESENTER = 'TASK_PRESENTER';
setNamespace(TASK_PRESENTER);
const taskPresenterStoreOptions = getStoreOptions();
taskPresenterStoreOptions.namespaced = true;
export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    [TASK_PRESENTER]: taskPresenterStoreOptions,
    checkboxInput,
    textInput,
    table,
    radioInput,
    textTagging,
    assistantLLM,
    dropdownInput,
    multiselectInput,
    conditionalDisplay,
    fileUpload,
    taskTimer,
    inputTextArea,
    taskPresenter,
    anco
  }
});
