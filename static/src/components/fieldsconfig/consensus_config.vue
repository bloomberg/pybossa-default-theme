<template>
  <div class="stats-config row">
    <div
      v-if="hasRetryFields"
      class="col-md-12 consensus"
    >
      <h3> Consensus Config</h3>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Consensus Method </p>
        </div>
        <div class="col-md-4">
          <select
            id="consensus-method"
            v-model="consensusMethod"
            name="consensus-method"
            class="form-control input-sm"
          >
            <option
              v-for="(conf, type, index) in consensusMethods.config"
              :key="index"
              :value="type"
            >
              {{ conf.display }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Agreement Threshold </p>
        </div>
        <div class="col-md-8 pull-right">
          <input
            v-model="agreementThreshold"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Consensus Threshold </p>
        </div>
        <div class="col-md-8">
          <input
            v-model="consensusThreshold"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Add Redundancy To Retry </p>
        </div>
        <div class="col-md-8 pull-right">
          <input
            v-model="redundancyConfig"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Maximum Retry </p>
        </div>
        <div class="col-md-8 pull-right">
          <input
            v-model="maxRetries"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <div
        v-if="errorMsg"
        class="error-msg"
      >
        {{ errorMsg }}
      </div>
      <div>
        <button
          class="btn btn-sm btn-primary"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters, mapMutations } from 'vuex';
import consensusMethods from './consensusMethods';
export default {
  data () {
    return {
      consensusMethods,
      consensusThreshold: null,
      maxRetries: null,
      redundancyConfig: null,
      errorMsg: '',
      capacity: 10000,
      agreementThreshold: null,
      consensusMethod: null
    };
  },

  computed: {
    ...mapGetters(['csrfToken', 'hasRetryFields', 'answerFields'])
  },

  created () {
    this.getData();
  },

  methods: {
    ...mapMutations(['updateConsensusConfig', 'setData']),

    initialize (data) {
      let config = JSON.parse(data.consensus_config);
      this.consensusThreshold = config.consensus_threshold;
      this.redundancyConfig = config.redundancy_config;
      this.agreementThreshold = config.agreement_threshold;
      this.consensusMethod = config.consensus_method;
      this.maxRetries = config.max_retries;
      this.setData({
        csrf: data.csrf,
        answerFields: JSON.parse(data.answer_fields),
        consensus: config
      });
    },

    _isIntegerNumeric: function (_n) {
      return Math.floor(_n) === _n;
    },

    getURL () {
      let path = window.location.pathname;
      let res = path.split('/');
      res[res.length - 1] = 'answerfieldsconfig';
      return res.join('/');
    },

    _write: function (_consensusThreshold, _redundancyConfig, _maxRetries, _agreementThreshold) {
      if (!this._isIntegerNumeric(_consensusThreshold) || _consensusThreshold <= 50 ||
        _consensusThreshold > 100) {
        this.errorMsg = 'Consensus Threshold should be integer within 50 - 100';
        return false;
      }
      if (!this._isIntegerNumeric(_redundancyConfig) || _redundancyConfig <= 0) {
        this.errorMsg = 'Redundancy should be positive integer';
        return false;
      }
      if (!this._isIntegerNumeric(_maxRetries) || _maxRetries <= 0 ||
        _maxRetries > this.capacity) {
        this.errorMsg = 'Maximum retries should be integer within 1 - ' + this.capacity;
        return false;
      }
      if (!this._isIntegerNumeric(_agreementThreshold) || _consensusThreshold <= 50 ||
        _consensusThreshold > 100) {
        this.errorMsg = 'Agreement Threshold should be integer within 50 - 100';
        return false;
      }
      this.errorMsg = '';
      return true;
    },

    async getData () {
      try {
        const res = await fetch(this.getURL(), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.initialize(data);
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    },

    async save () {
      let data = { answer_fields: this.answerFields };
      if (this.hasRetryFields) {
        let _consensusThreshold = parseInt(this.consensusThreshold, 10);
        let _redundancyConfig = parseInt(this.redundancyConfig, 10);
        let _maxRetries = parseInt(this.maxRetries, 10);
        let _agreementThreshold = parseInt(this.agreementThreshold, 10);
        let _consensusMethod = this.consensusMethod;
        if (!this._write(_consensusThreshold, _redundancyConfig, _maxRetries, _agreementThreshold)) {
          return;
        }
        data['consensus_config'] = {
          'consensus_threshold': _consensusThreshold,
          'max_retries': _maxRetries,
          'redundancy_config': _redundancyConfig,
          'agreement_threshold': _agreementThreshold,
          'consensus_method': _consensusMethod
        };
        this.updateConsensusConfig(data['consensus_config']);
      }
      try {
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const data = await res.json();
          window.pybossaNotify(data['flash'], true, data['status']);
        } else {
          window.pybossaNotify('An error occurred configuring answer field config.', true, 'error');
        }
      } catch (error) {
        window.pybossaNotify('An error occurred configuring answer field config.', true, 'error');
      }
    }
  }
};
</script>
<style scoped>
.error-msg {
  color: red;
}

.form-control.input-sm {
  width: 280px;
}

.align-right {
  text-align: right;
}

.consensus {
  width: 85%
}
</style>
