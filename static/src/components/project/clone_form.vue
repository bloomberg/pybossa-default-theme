/* eslint-disable vue/no-v-html */
<template>
  <div>
    <p>
      Clone a job will copy all aspects of the current project except tasks.
    </p>
    <vue-form-generator
      ref="cloneForm"
      :schema="schema"
      :model="model"
      :options="formOptions"
      @validated="onValidated"
      @model-updated="onModelUpdate"
    />
    <div>
      <button
        :disabled="!validForm"
        class="btn btn-sm btn-primary"
        @click="save"
      >
        Clone
      </button>
    </div>
  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import '../setting/vfg-custom-components.css';
import VueFormGenerator from '../form_validators';
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

Vue.component('multiselect', Multiselect);

export default {
  components: {
        'vue-form-generator': VueFormGenerator.component },
  props: [ 'hiddenInputs', 'csrf', 'form' ],
  data () {
    return {
      csrfToken: null,
      validForm: false,
      model: {
        name: '',
        short_name: 'false',
        password: '',
        copyUsers: false,
        hiddenInputs: [],
        errors: {}
      },
        schema: {
              fields: [
                        {
                        type: 'input',
                        inputType: 'text',
                        label: 'Name',
                        model: 'name',
                        required: true,
                        validator: ['serverValidation', VueFormGenerator.validators.string],
                        onChanged: function (model, newVal, oldVal, field) {
                          model.errors[field.model] = [];
                        } },
                        {
                        type: 'input',
                        inputType: 'text',
                        label: 'Short Name',
                        model: 'short_name',
                        required: true,
                        validator: ['serverValidation', VueFormGenerator.validators.string],
                        onChanged: function (model, newVal, oldVal, field) {
                          model.errors[field.model] = [];
                        } },
                        {
                        type: 'input',
                        inputType: 'password',
                        label: 'Project Password',
                        model: 'password',
                        required: true,
                        placeholder: 'Password must contain at least one uppercase, one lowercase, one numeric character.',
                        validator: ['serverValidation', VueFormGenerator.validators.string],
                        onChanged: function (model, newVal, oldVal, field) {
                          model.errors[field.model] = [];
                        } },
                        {
                        type: 'switch',
                        label: 'Keep same list of assigned users',
                        model: 'copyUsers',
                        multi: true,
                        default: false,
                        textOn: 'Yes',
                        textOff: 'No',
                        visible (model) {
                          return !model.hiddenInputs.includes('copy_users');
                        },
                        validator: [] }

            ]
        },
        formOptions: {
                      validateAfterLoad: true,
                      validateAfterChanged: true,
                      validationErrorClass: 'has-error'
        }
      };
  },
  created () {
    this.initialize();
  },

  methods: {
    initialize (data) {
      const form = data ? data.form : this.form;
      this.model.short_name = form.short_name;
      this.model.name = form.name;
      this.model.password = form.password;
      this.model.copyUsers = form.copyUsers;
      this.model.hiddenInputs = data ? data.hidden_inputs : this.hiddenInputs;
      this.model.errors = form.errors || {};
      this.csrfToken = data ? data.csrf : this.csrf;
    },

    onValidated (isValid, errors) {
      this.validForm = isValid;
    },

    onModelUpdate () {
        this.runValidationOnFields(['short_name', 'name', 'password']);
    },

    runValidationOnFields (fields) {
        this.$refs.cloneForm.$children.forEach(function (input) {
          if (fields.includes(input.field.model)) {
            input.$children[0].validate();
        }
    });
    },

    getURL () {
      return `/project/${this.form.short_name}/clone`;
    },

    async save () {
      try {
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({
              short_name: this.model.short_name,
              name: this.model.name,
              password: this.model.password,
              copy_users: this.model.copyUsers
          })
        });
        if (res.ok) {
          const data = await res.json();
          // if no errors
          if (Object.keys(data.form.errors).length === 0) {
            window.location = `/project/${data.form.short_name}/`;
          }

          this.initialize(data);
          this.runValidationOnFields(['short_name', 'name', 'password']);
          window.pybossaNotify(data['flash'], true, data['status']);
        } else {
          window.pybossaNotify('An error occurred cloning this job.', true, 'error');
        }
      } catch (error) {
         window.pybossaNotify('An error occurred on the server.', true, 'error');
      }
     }
  }
};
</script>
