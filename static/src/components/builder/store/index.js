import Vue from 'vue';
import Vuex from 'vuex';
import textInput from './modules/textInput';
import checkboxInput from './modules/checkboxInput';
import table from './modules/table';
import radioInput from './modules/radioInput';
import textTagging from './modules/textTagging';
import dropdownInput from './modules/dropdownInput';
import multiselectInput from './modules/multiselectInput';
import conditionalDisplay from './modules/conditionalDisplay';
import fileUpload from './modules/fileUpload';
import taskTimer from './modules/taskTimer';
import inputTextArea from './modules/inputTextArea';

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
    dropdownInput,
    multiselectInput,
    conditionalDisplay,
    fileUpload,
    taskTimer,
    inputTextArea
  }
});
