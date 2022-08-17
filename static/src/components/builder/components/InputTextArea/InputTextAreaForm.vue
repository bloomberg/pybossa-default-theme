<template>
  <div class="row">
    <h4>Input Text Area Settings</h4>
    <div class="form-row">
      <input
        id="add-label"
        :checked="labelAdded"
        type="checkbox"
        @input="updateLabelAdded($event.target.checked)"
      >
      <label for="add-label">
        Add Label
      </label>
      <input
        v-if="labelAdded"
        id="component-label"
        :value="label"
        class="form-control form-control-sm"
        type="text"
        @input="updateLabel($event.target.value)"
      >
    </div>

    <div class="form-row">
      <label class="col-labels">
        Number of rows
      </label>
      <input
          id="rows"
          :value="rows"
          class="form-control form-control-sm"
          type="number"
          @input="updateRows($event.target.value)"
      >
    </div>

    <validator
      :validations="validations"
      :validation-options="filteredValidations"
      :update-validations="updateValidations"
    />

    <div class="form-row">
      <label
        for="pyb-answer"
        class="col-labels"
      >
        Answer field name | <span class="label-tip">The field where the worker's answer is stored. Can be JSON path like a.b.c.</span>
      </label>
      <input
        id="pyb-answer"
        :value="pybanwer"
        class="form-control form-control-sm"
        type="text"
        @input="updatePybanswer($event.target.value)"
      >
    </div>
  </div>
</template>

<script>
import '../../../../../css/component_builder.css';
import Validator from '../validator';
import * as types from '../../store/types';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'InputTextAreaForm',
  components: { Validator },
    data () {
    return {
      validationOptions: ['required']
    };
  },
  computed: {
    filteredValidations: function () {
      return [{ name: 'required' }];
    },
    ...mapState({
      label: state => state.inputTextArea.label,
      labelAdded: state => state.inputTextArea.labelAdded,
      pybanwer: state => state.inputTextArea['pyb-answer'],
      rows: state => state.inputTextArea.rows,
      cols: state => state.inputTextArea.cols,
      validations: state => state.inputTextArea.validations
    })
  },
  methods: {
    ...mapMutations({
      'updateLabel': types.MUTATE_INPUT_TEXT_AREA_LABEL,
      'updateLabelAdded': types.MUTATE_INPUT_TEXT_AREA_LABEL_ADDED,
      'updatePybanswer': types.MUTATE_INPUT_TEXT_AREA_PYB_ANSWER,
      'updateValidations': types.MUTATE_INPUT_TEXT_AREA_VALIDATIONS,
      'updateRows': types.MUTATE_INPUT_TEXT_AREA_ROWS,
      'updateCols': types.MUTATE_INPUT_TEXT_AREA_COLS
    })
  }
};
</script>
