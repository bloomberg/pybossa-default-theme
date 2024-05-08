import Vue from 'vue';
import setting from './components/setting/index.vue';
import taskSetting from './components/setting/task_setting.vue';
import quizSetting from './components/setting/quiz_setting.vue';
import ownershipSetting from './components/setting/ownership_setting.vue';
import Vuex from 'vuex';
import FieldsConfig from './components/fieldsconfig/index';
import RedundancyConfig from './components/fieldsconfig/redundancy_config';
import ConsensusSetting from './components/setting/consensus_setting';
import { storeSpecs } from './components/fieldsconfig/store';

Vue.use(Vuex);

const store = new Vuex.Store(storeSpecs);

const app = new Vue({
  el: '#setting',
  store,
  components: {
    FieldsConfig,
    RedundancyConfig,
    setting,
    taskSetting,
    quizSetting,
    ownershipSetting,
    ConsensusSetting
  }
});

window.answerFields = {
  setData: store.commit.bind(null, 'setData')
};

export default app;
