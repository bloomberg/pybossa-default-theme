<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div
          v-if="$route.path.includes('code')"
          class="card-body"
        >
          <h4>Task presenter code</h4>
          <span
            v-if="!form.isValidForm.isValid"
            class="message-color"
          >{{ validationErrors }}
          </span>
          <!-- This line is space sensives it can lose the code format  -->
          <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
          <prism language="html">{{ snippet }}</prism>
        </div>
        <div
          v-if="$route.path.includes('preview')"
          class="card-body"
        >
          <h4>Preview</h4>
          <span
            v-if="!form.isValidForm.isValid"
            class="message-color"
          >{{ validationErrors }}
          </span>
          <form class="form-horizontal">
            <div class="col-md-12">
              <label v-if="form.isValidForm.isValid && form.labelAdded">
                {{ form.label }}
              </label>
              <ComponentRender
                :selected-component="
                  componentsNames[$route.params.componentName]
                "
                :form="form"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.message-color {
  color: crimson;
  white-space: pre;
}
</style>

<script>
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
import ComponentRender from './ComponentRender/ComponentRender';
import components from '@dtwebservices/task-presenter-components';
import * as types from '../store/types';
import utils from '../utils';

export default {
  components: {
    ...components,
    ComponentRender,
    Prism
  },
  data () {
    return {
      componentsNames: {
        TEXT_INPUT: 'text-input',
        CHECKBOX_INPUT: 'checkbox-creator',
        RADIO_INPUT: 'radio-group-input',
        TABLE: 'table-creator',
        TASK_TIMER: 'task-timer',
        TASK_PRESENTER: 'task-presenter',
        CANCEL_BUTTON: 'cancel-button',
        SUBMIT_BUTTON: 'submit-button',
        BUTTON_ROW: 'button-row',
        SUBMIT_LAST_BUTTON: 'submit-last-button',
        TEXT_TAGGING: 'text-tagging',
        ASSISTANT_LLM: 'assistant-llm',
        DROPDOWN_INPUT: 'dropdown-input',
        MULTISELECT_INPUT: 'multi-select-input',
        CONDITIONAL_DISPLAY: 'conditionaldisplay-creator',
        FILE_UPLOAD: 'file-upload',
        INPUT_TEXT_AREA: 'input-text-area'
      }
    };
  },
  computed: {
    validationErrors: {
      get () {
        return (this.form.isValidForm.messages || ['Component properties are not complete, please review form'])
          .map(message => `                ** ${message} **`)
          .join('\n');
      }
    },
    isValidForm: {
      get () {
        const getFormValidType =
          types[`GET_${this.$route.params.componentName}_FORM_VALID`];
        const isValidForm = getFormValidType
          ? this.$store.getters[getFormValidType]
          : { isValid: true };
        return isValidForm;
      }
    },
    form: {
      get () {
        let form = { isValidForm: this.isValidForm };
        const getFormType =
          types[`GET_${this.$route.params.componentName}_PROPS`];
        if (getFormType) {
          form = {
            ...this.$store.getters[getFormType],
            isValidForm: this.isValidForm
          };
        }
        return form;
      }
    },
    snippet: {
      get () {
        return utils.getSnippet(this.$route.params.componentName, this.form);
      }
    }
  }
};
</script>
