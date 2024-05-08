<template>
  <div class="stats-config row">
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
            consensusMethod: null,
            agreementThreshold: null,
            errorMsg: ''
        };
    },

    computed: {
        ...mapGetters(['csrfToken'])
    },

    created () {
        this.getData();
    },

    methods: {
        ...mapMutations(['updateConsensusConfig', 'setData']),

        initialize (data) {
            let config = JSON.parse(data.consensus_config);
            this.consensusMethod = config.consensus_method;
            this.agreementThreshold = config.agreement_threshold;
            this.setData({
                csrf: data.csrf,
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

        _write: function (_agreementThreshold) {
            if (!this._isIntegerNumeric(_agreementThreshold) || _agreementThreshold <= 50 ||
                _agreementThreshold > 100) {
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
                print('consnss confg got dataa:', data);
                this.initialize(data);
            } catch (error) {
                window.pybossaNotify('An error occurred.', true, 'error');
                console.log(error);
            }
        },

        async save () {
            let _agreementThreshold = parseInt(this.agreementThreshold, 10);
            let _consensusMethod = parseInt(this.consensusMethod, 'majority');
            if (!this._write(_agreementThreshold)) {
                return;
            }
            let data = {
                'consensus_config': {
                    'agreement_threshold': _agreementThreshold,
                    'consensus_method': _consensusMethod
                }
            };
            this.updateConsensusConfig(data['consensus_config']);
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
                    window.pybossaNotify('An error occurred configuring consensus settings.', true, 'error');
                }
            } catch (error) {
                window.pybossaNotify('An error occurred configuring answer consensus settings.', true, 'error');
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
