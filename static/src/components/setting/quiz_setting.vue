/* eslint-disable vue/no-v-html */
<template>
  <div v-if="dataLoaded">
    <label>
      Number of gold tasks: {{ model.n_gold_unexpired }}
    </label>
    <p>
      In order to enable and configure quiz mode, this project must have at least one gold question. Please click
      <a
        :href="`/project/${getProjectName()}/make-random-gold`"
      >here</a> to create gold questions.
    </p>
    <vue-form-generator
      ref="quizForm"
      :schema="schema"
      :model="model"
      :options="formOptions"
      @validated="onValidated"
      @model-updated="onModelUpdate"
    />
    <table-quiz
      :users="users"
      :model="model"
      :quiz-mode-choices="quizModeChoices"
      @updateUsers="updateUsers"
    />
    <div>
      <button
        :disabled="!validForm"
        class="btn btn-sm btn-primary"
        @click="save"
      >
        Save
      </button>
    </div>
  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import './vfg-custom-components.css';
import VueFormGenerator from './quiz_form_validators';
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import TableQuiz from './quiz_result_table.vue';

Vue.component('multiselect', Multiselect);
Vue.component('table-quiz', TableQuiz);

export default {
  components: {
        'vue-form-generator': VueFormGenerator.component },
  data () {
    return {
      csrfToken: null,
      users: {},
      dataLoaded: false,
      validForm: false,
      quizModeChoices: {},

      model: {
        n_gold_unexpired: 0,
        enabled: false,
        questions: 0,
        passing: 0,
        completion_mode: '' },
        schema: {
              fields: [
                {
                        type: 'switch',
                        label: 'Turn quiz mode on or off',
                        hint: 'When quiz mode is on, all new workers will take a quiz. See the table below to configure individual workers. To turn quiz mode off for a worker, uncheck the box next to their name and click the Reset button. Make sure their name is enabled if you want them to take the quiz.',
                        model: 'enabled',
                        multi: true,
                        default: false,
                        textOn: 'Quiz On',
                        textOff: 'Quiz Off',
                        validator: ['enabledValidation'] },
                     {
                        type: 'input',
                        inputType: 'number',
                        label: 'Number of questions per quiz',
                        model: 'questions',
                        min: 1,
                        required: true,
                        validator: ['minQuestions', 'serverValidation', VueFormGenerator.validators.integer] },
                      {
                        id: 'passing',
                        type: 'input',
                        inputType: 'number',
                        label: 'Number of correct answers to pass quiz',
                        model: 'passing',
                        min: 1,
                        required: true,
                        validator: ['maxPassingQuestions', 'serverValidation', VueFormGenerator.validators.integer],
                        onChanged: function (model, newVal, oldVal, field) {
                          model.errors[field.model] = [];
                        } },
                      {
                        type: 'select',
                        label: 'Finish the quiz session when:',
                        model: 'completion_mode',
                        required: true,
                        values: (model) => {
                          const listOptions = [];
                          for (const [key, value] of Object.entries(this.quizModeChoices)) {
                            listOptions.push({ id: key, name: value });
                          }
                          return listOptions;
                        },
                        default: 'short_circuit'
                        }
            ]
        },
        formOptions: {
                      validateAfterLoad: true,
                      validateAfterChanged: true,
                      validationErrorClass: 'error'
        }
      };
  },
  created () {
    this.getData();
  },

  methods: {
    initialize (data) {
      this.model.n_gold_unexpired = data.n_gold_unexpired;
      this.csrfToken = data.csrf;
      this.users = this.getQuizUser(data.all_user_quizzes);
      this.model.enabled = data.form.enabled;
      this.model.questions = data.form.questions;
      this.model.passing = data.form.passing;
      this.model.completion_mode = data.form.completion_mode;
      this.model.errors = {};
      this.dataLoaded = true;
      this.quizModeChoices = Object.fromEntries(data.quiz_mode_choices);
    },
    onValidated (isValid, errors) {
      this.validForm = isValid;
    },

    runValidationOnFields (fields) {
        this.$refs.quizForm.$children.forEach(function (input) {
          if (fields.includes(input.field.model)) {
            input.$children[0].validate();
        }
    });
    },

    onModelUpdate () {
        this.runValidationOnFields(['questions', 'passing']);
    },

    updateUsers (user) {
      this.users[user.id] = user;
    },

    getQuizUser (allUserQuiz) {
      var users = {};
      for (var i = 0; i < allUserQuiz.length; i++) {
        var u = allUserQuiz[i];
        u.quiz.config.reset = false;
        users[u.id] = u;
      }
      return users;
    },

    getProjectName () {
        const regex = new RegExp('/project/([^/]+)');
        const match = window.location.href.match(regex);
        let projectName;
        if (match) {
            projectName = match[1];
        }
        return projectName;
    },

    getURL () {
      return `/project/${this.getProjectName()}/quiz-mode`;
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
        if (res.ok) {
          const data = await res.json();
          this.initialize(data);
        } else {
          window.pybossaNotify('An error occurred configuring quiz mode.', true, 'error');
        }
      } catch (error) {
        window.pybossaNotify('An error occurred on the server.', true, 'error');
      }
    },
    async save () {
      try {
        this.dataLoaded = false;
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({
              enabled: this.model.enabled,
              questions: this.model.questions,
              passing: this.model.passing,
              completion_mode: this.model.completion_mode,
              users: Object.values(this.users)
          })
        });
        if (res.ok) {
          this.dataLoaded = true;
          const data = await res.json();
          this.initialize(data);
          this.model.errors = data.form.errors;
          this.runValidationOnFields(['questions', 'passing']);

          window.pybossaNotify(data['flash'], true, data['status']);
        } else {
          window.pybossaNotify('An error occurred configuring quiz mode.', true, 'error');
        }
      } catch (error) {
         window.pybossaNotify('An error occurred on the server.', true, 'error');
      }
     }
  }
};
</script>
