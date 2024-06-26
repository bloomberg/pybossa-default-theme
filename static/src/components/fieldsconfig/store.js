import Vue from 'vue';

function _addField (state, { name, type, config, retryForConsensus, newField = false }) {
  if (state.answerFields.hasOwnProperty(name)) {
    return;
  }
  if (newField) {
    state.newFields[name] = true;
  }
  Vue.set(state.answerFields, name, { type, config, 'retry_for_consensus': retryForConsensus });
  state.fieldNames.push(name);
}

function _updateRedundancyConfig (state, config) {
  if (config) {
    const cf = {
      consensusThreshold: config['consensus_threshold'],
      maxRetries: config['max_retries'],
      redundancyConfig: config['redundancy_config']
    };
    state.redundancyConfig = cf;
  }
}

function _updateConsensusConfig (state, config) {
  if (config) {
    const cf = {
      consensusMethod: config['consensus_method'],
      agreementThreshold: config['agreement_threshold']
    };
    state.consensusConfig = cf;
  }
}

function _isNewField (state, field) {
  return !!state.newFields[field];
}

function _showWarning (state, field) {
  if (!_isNewField(state, field)) {
    state.showWarning = true;
  }
}

const storeSpecs = {
  state: {
    csrf: '',
    fieldNames: [],
    answerFields: {},
    consensusConfig: {},
    redundancyConfig: {},
    newFields: {},
    showWarning: false
  },

  getters: {
    answerFields (state) {
      const rv = {};
      state.fieldNames.forEach((name) => {
        rv[name] = state.answerFields[name];
      });
      return rv;
    },

    csrfToken (state) {
      return state.csrf;
    },

    isNewField: (state) => (name) => {
      const f = state.newFields[name] || false;
      return f;
    },

    hasRetryFields (state) {
      for (const name in state.answerFields) {
        if (state.answerFields[name]['retry_for_consensus']) {
            return true;
        }
      }
      return false;
    },

    showWarning (state) {
      return state.showWarning;
    },

    redundancyConfig (state) {
      return state.redundancyConfig;
    },

    consensusConfig (state) {
      return state.consensusConfig;
    }
  },

  mutations: {
    addField (state, payload) {
      _addField(state, payload);
    },

    addFieldConfig (state, { name, config }) {
      state.answerFields[name].config = config;
      _showWarning(state, name);
    },

    deleteField (state, { name }) {
      const ix = state.fieldNames.indexOf(name);
      _showWarning(state, name);
      if (ix >= 0) {
        state.fieldNames.splice(ix, 1);
        state.answerFields[name]['retry_for_consensus'] = false;
      }
      delete state.answerFields[name];
    },

    updateRedundancyConfig (state, config) {
      _updateRedundancyConfig(state, config);
    },

    updateConsensusConfig (state, config) {
      _updateConsensusConfig(state, config);
    },

    changeRetryConfig (state, { name, retry }) {
      state.answerFields[name]['retry_for_consensus'] = retry;
    },

    setCSRF (state, csrf) {
      state.csrf = csrf;
    },

    setAnswerFields (state, answerFields) {
      for (const name in answerFields) {
        const retryForConsensus = answerFields[name]['retry_for_consensus'];
        const { type, config } = answerFields[name];
        _addField(state, { name, type, config, retryForConsensus });
      }
    },

    setData (state, { csrf, answerFields, config }) {
      state.csrf = csrf;
      const fields = answerFields;
      for (const name in fields) {
        const retryForConsensus = fields[name]['retry_for_consensus'];
        const { type, config } = fields[name];
        _addField(state, { name, type, config, retryForConsensus });
      }
      _updateRedundancyConfig(state, config);
    }
  }
};

export { storeSpecs };
