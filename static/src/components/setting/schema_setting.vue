<template>
  <div class="stats-config row">
    <h3>Schema Settings</h3>

    <div class="form-group row">
      <div class="col-md-12">
        <label for="task-info-schema">Task Info Schema (JSON)</label>
        <textarea ref="taskInfoEditor" v-model="taskInfoSchema" class="form-control schema-textarea" rows="8"
          placeholder="Enter JSON schema for task info..."></textarea>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-md-12">
        <label for="task-answer-schema">Task Answer Schema (JSON)</label>
        <textarea ref="taskAnswerEditor" v-model="taskAnswerSchema" class="form-control schema-textarea" rows="8"
          placeholder="Enter JSON schema for task answers..."></textarea>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-md-12">
        <div class="checkbox">
          <label>
            <input v-model="strictValidation" type="checkbox">
            Strictly enforce schema validation
          </label>
        </div>
      </div>
    </div>

    <div class="col-md-12">
      <div v-if="errorMsg" class="error-msg">
        {{ errorMsg }}
      </div>
      <div>
        <button class="btn btn-sm btn-primary" @click="save">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';

export default {
  data() {
    return {
      taskInfoSchema: '',
      taskAnswerSchema: '',
      strictValidation: false,
      errorMsg: '',
      taskInfoEditor: null,
      taskAnswerEditor: null,
      visibilityObserver: null
    };
  },

  computed: {
    ...mapGetters(['csrfToken'])
  },

  created() {
    this.getData();
  },

  mounted() {
    this.setupVisibilityObserver();
  },

  activated() {
    this.$nextTick(() => {
      this.refreshEditorsIfVisible();
    });
  },

  beforeDestroy() {
    // Clean up intersection observer
    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
    }
    if (this.taskInfoEditor && this.taskInfoEditor.toTextArea) {
      this.taskInfoEditor.toTextArea();
    }
    if (this.taskAnswerEditor && this.taskAnswerEditor.toTextArea) {
      this.taskAnswerEditor.toTextArea();
    }
  },

  methods: {
    ...mapMutations(['setData']),

    setupVisibilityObserver() {
      // detect when component becomes visible
      if (typeof IntersectionObserver !== 'undefined') {
        this.visibilityObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.$nextTick(() => {
                this.refreshEditorsIfVisible();
              });
            }
          });
        });
        // Observe the component root element
        if (this.$el) {
          this.visibilityObserver.observe(this.$el);
        }
      }
    },

    refreshEditorsIfVisible() {
      // Check if component is actually visible before refreshing
      if (this.$el && this.$el.offsetParent !== null) {
        if (this.taskInfoEditor) {
          this.taskInfoEditor.refresh();
        }
        if (this.taskAnswerEditor) {
          this.taskAnswerEditor.refresh();
        }
      }
    },

    initializeEditors() {
      // Don't initialize if already initialized
      if (this.taskInfoEditor || this.taskAnswerEditor) {
        return;
      }

      const config = {
        mode: "javascript",
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true,
        gutters: ["CodeMirror-linenumbers"],
        theme: "default"
      };

      // Initialize Task Info Schema editor
      if (this.$refs.taskInfoEditor) {
        this.$refs.taskInfoEditor.value = this.taskInfoSchema;
        this.taskInfoEditor = CodeMirror.fromTextArea(this.$refs.taskInfoEditor, config);

        this.taskInfoEditor.on('change', () => {
          this.taskInfoSchema = this.taskInfoEditor.getValue();
        });
      }

      // Initialize Task Answer Schema editor
      if (this.$refs.taskAnswerEditor) {
        this.$refs.taskAnswerEditor.value = this.taskAnswerSchema;
        this.taskAnswerEditor = CodeMirror.fromTextArea(this.$refs.taskAnswerEditor, config);

        this.taskAnswerEditor.on('change', () => {
          this.taskAnswerSchema = this.taskAnswerEditor.getValue();
        });
      }
    },

    initialize(data) {
      this.taskInfoSchema = this.formatJsonString(data.task_info_schema || '');
      this.taskAnswerSchema = this.formatJsonString(data.task_answer_schema || '');
      this.strictValidation = data.strict_validation || false;

      this.initializeEditors();
    },

    formatJsonString(jsonString) {
      if (typeof jsonString == "object") {
        return JSON.stringify(jsonString)
      }
      if (!jsonString || jsonString.trim() === '') {
        return '';
      }
      let parsed = JSON.parse(jsonString);
      if (typeof parsed == "string") {
        parsed = JSON.parse(parsed);
      }
      return JSON.stringify(parsed, null, 2);
    },

    validateJsonSchema(schema) {
      if (!schema.trim()) return true; // Empty schema is valid
      try {
        JSON.parse(schema);
        return true;
      } catch (error) {
        return false;
      }
    },

    getURL() {
      let path = window.location.pathname;
      let res = path.split('/');
      res[res.length - 1] = 'schema-config';
      return res.join('/');
    },

    validateInput() {
      this.errorMsg = '';

      if (this.taskInfoSchema && !this.validateJsonSchema(this.taskInfoSchema)) {
        this.errorMsg = 'Task Info Schema contains invalid JSON';
        return false;
      }

      if (this.taskAnswerSchema && !this.validateJsonSchema(this.taskAnswerSchema)) {
        this.errorMsg = 'Task Answer Schema contains invalid JSON';
        return false;
      }

      return true;
    },

    async getData() {
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
        window.pybossaNotify('An error occurred loading schema settings.', true, 'error');
        console.log(error);
      }
    },

    async save() {
      if (!this.validateInput()) {
        return;
      }

      const data = {
        task_info_schema: this.taskInfoSchema.trim(),
        task_answer_schema: this.taskAnswerSchema.trim(),
        strict_validation: this.strictValidation
      };

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
          const responseData = await res.json();
          window.pybossaNotify(responseData['flash'] || 'Schema settings saved successfully.', true, responseData['status'] || 'success');
        } else {
          window.pybossaNotify('An error occurred saving schema settings.', true, 'error');
        }
      } catch (error) {
        window.pybossaNotify('An error occurred saving schema settings.', true, 'error');
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.error-msg {
  color: red;
  margin-bottom: 15px;
}

.schema-textarea {
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
}

.checkbox {
  margin: 15px 0;
}

.checkbox label {
  font-weight: normal;
  cursor: pointer;
}
</style>

<style>
/* Global CodeMirror styles (not scoped) */
.CodeMirror {
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 200px;
  font-size: 12px;
  font-family: 'Courier New', Courier, monospace;
}

.CodeMirror-scroll {
  min-height: 200px;
}

/* Gutter styles */
.CodeMirror-gutters {
  border-right: 1px solid #ddd;
  background-color: #f7f7f7;
  white-space: nowrap;
}

.CodeMirror-linenumber {
  padding: 0 3px 0 5px;
  min-width: 20px;
  text-align: right;
  color: #999;
  white-space: nowrap;
}
</style>
