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
            v-if="!form.isValidForm"
            class="message-color"
          >
            ** Component properties are not complete, please review form **
          </span>
          <prism language="html">
            {{ snippet }}
          </prism>
        </div>
        <div
          v-if="$route.path.includes('preview')"
          class="card-body"
        >
          <h4>Preview</h4>
          <form class="form-horizontal">
            <div class="col-md-12">
              <label v-if="form.labelAdded">
                {{ form.label.value }}
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
}
</style>

<script>
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
import ComponentRender from './ComponentRender';
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
        TABLE: 'table-creator',
        TIMER: 'static-task-timer',
        TASK_PRESENTER: 'task-presenter',
        CANCEL_BUTTON: 'cancel-button',
        SUBMIT_BUTTON: 'submit-button',
        BUTTON_ROW: 'button-row',
        SUBMIT_LAST_BUTTON: 'submit-last-button'
      }
    };
  },
  computed: {
    isValidForm: {
      get () {
        const getFormValidType =
          types[`GET_${this.$route.params.componentName}_FORM_VALID`];
        const isValidForm = getFormValidType
          ? this.$store.getters[getFormValidType]
          : true;
        return isValidForm;
      }
    },
    form: {
      get () {
        let form = { isValidForm: true };
        const getFormType =
          types[`GET_${this.$route.params.componentName}_FORM`];
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
