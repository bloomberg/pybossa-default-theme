<template>
  <div class="stats-config row">
    <div
      id="answer-field-config"
      class="col-md-12"
    >
      <h3>Answer Field Config</h3>
      <div
        class="form-group"
        :class="{'has-error': error}"
      >
        <div class="form-group row">
          <div class="col-sm-4">
            <p> Answer Field Name And Type</p>
          </div>
          <div class="col-sm-4">
            <input
              id="answer-field"
              v-model="fieldName"
              type="text"
              class="form-control input-sm"
            >
          </div>
          <div class="col-sm-4">
            <select
              id="answer-field"
              v-model="fieldType"
              name="field-type"
              class="form-control input-sm"
            >
              <option
                v-for="(conf, type, index) in labelTypes.config"
                :key="index"
                :value="type"
              >
                {{ conf.display }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-4">
            <p> Retry For Consensus </p>
          </div>
          <div class="col-sm-4">
            <label class="switch">
              <input
                v-model="retryForConsensus"
                type="checkbox"
              >
              <span class="slider" />
            </label>
          </div>
          <div class="col-sm-4 pull-right">
            <button
              class="btn btn-sm btn-primary"
              :disabled="!fieldName"
              @click="_addField"
            >
              Add Field
            </button>
            <span
              v-if="error"
              class="help-block"
            >
              {{ error }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="!Object.keys(answerFields).length">
        <p> * No fields currently configured.</p>
      </div>
      <div
        v-else
      >
        <div
          v-for="(field, name) in answerFields"
          :key="name"
          class=""
        >
          <div class="col-md-12 card">
            <div class="thumbnail card-body">
              <component
                :is="labelTypes.config[field.type].component"
                :key="name"
                :name="name"
                :retry-for-consensus="answerFields[name]['retry_for_consensus']"
                :edit="isNewField(name)"
                v-bind="field.config"
                :type="labelTypes.config[field.type].display"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showWarning"
        class="alert alert-danger"
      >
        <strong>Warning:</strong>
        changing or updating a field configuration will delete the associated
        performance statistics.
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';
import FieldConfigBase from './field_config_base';
import CategoricalFieldConfig from './categorical_field_config';
import CategoricalNestedFieldConfig from './categorical_nested_field_config';
import labelTypes from './labelTypes';

export default {
  components: {
    CategoricalFieldConfig,
    CategoricalNestedFieldConfig,
    FieldConfigBase
  },

  data () {
    return {
      fieldName: '',
      fieldType: labelTypes.default,
      retryForConsensus: false,
      error: false,
      labelTypes,
      message1: 'This should match "pyb-answer" in your task presenter',
      message2: 'Consensus configuration must be filled out to enable retry feature'
    };
  },

  computed: {
    ...mapGetters(['answerFields', 'csrfToken', 'isNewField', 'hasRetryFields', 'showWarning'])
  },

  methods: {
    ...mapMutations(['addField']),

    _addField () {
      if (!this.fieldName) {
        this.error = 'Field Name is Required.';
        return;
      }
      this.addField({
        name: this.fieldName,
        type: this.fieldType,
        retryForConsensus: this.retryForConsensus,
        config: labelTypes.config[this.fieldType].defaultConfig(),
        newField: true
      });
      this.reset();
    },

    reset () {
      this.fieldName = '';
      this.fieldType = labelTypes.default;
      this.retryForConsensus = false;
    }
  }
};

</script>
<style scoped>
#answer-field {
  width: 100%
}
#answer-field-config{
  width: 85%
}
</style>
