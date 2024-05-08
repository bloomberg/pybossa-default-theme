<template>
  <div
    class="stats-config row"
  >
    <div
      v-if="hasRetryFields"
      class="col-md-12 consensus"
    >
    <h3>Redundancy Config</h3>
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

export default {
  data () {
    return {
        consensusThreshold: null,
        maxRetries: null,
        redundancyConfig: null,
        errorMsg: '',
        capacity: 10000
    };
  },

  computed: {
    ...mapGetters(['csrfToken', 'hasRetryFields', 'answerFields'])
  },

  created () {
    this.getData();
  },

  methods: {
    ...mapMutations(['updateRedundancyConfig', 'setData']),

    initialize (data) {
      let config = JSON.parse(data.consensus_config);
      this.consensusThreshold = config.consensus_threshold;
      this.redundancyConfig = config.redundancy_config;
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

    _write: function (_consensusThreshold, _redundancyConfig, _maxRetries) {
        if (!this._isIntegerNumeric(_consensusThreshold) || _consensusThreshold <= 50 ||
          _consensusThreshold > 100) {
            this.errorMsg = 'Threshold should be integer within 50 - 100';
            return false;
        }
        if (!this._isIntegerNumeric(_redundancyConfig) || _redundancyConfig <= 0) {
            this.errorMsg = 'Redundancy should be positive integer';
            return false;
        }
        if (!this._isIntegerNumeric(_maxRetries) || _maxRetries <= 0 ||
                _maxRetries > this.capacity) {
            this.errorMsg = 'Maximum redundancy should be integer within 1 - ' + this.capacity;
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
            if (!this._write(_consensusThreshold, _redundancyConfig, _maxRetries)) {
                return;
            }
            data['redundancy_config'] = {
                    'consensus_threshold': _consensusThreshold,
                    'max_retries': _maxRetries,
                    'redundancy_config': _redundancyConfig
                  };
            this.updateRedundancyConfig(data['redundancy_config']);
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
    text-align:right;
}
.consensus {
    width: 85%
}
</style>
