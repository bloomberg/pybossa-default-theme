<template>
  <!-- eslint-disable vue/multiline-html-element-content-newline  -->

  <div class="row">
    <div class="col-md-4">
      <custom-router-link :component="taskPresenter" />
      <custom-router-link :component="buttonRow" />
      <custom-router-link :component="submitButton" />
      <custom-router-link :component="submitLastButton" />
      <custom-router-link :component="cancelButton" />
      <custom-router-link :component="taskTimer" />
      <custom-router-link :component="conditionalDisplay" />
      <custom-router-link :component="fileUpload" />
      <custom-router-link :component="textInput" />
      <custom-router-link :component="checkboxInput" />
      <custom-router-link :component="radioInput" />
      <custom-router-link :component="dropdownInput" />
      <custom-router-link :component="multiselectInput" />
      <custom-router-link :component="table" />
      <custom-router-link :component="textTagging" />
      <custom-router-link
        :component="assistantLLM"
        :style="!isPrivate ? 'display:none' : ''"
      />
      <custom-router-link :component="inputTextArea" />
    </div>
    <div class="col-md-8">
      <div class="row">
        <h3 class="text-color">
          Guide
        </h3>
        <a
          href="https://bbgithub.dev.bloomberg.com/GIGwork/pybossa-vue/wiki/Pybossa-Presenter-Components#include-the-files"
          target="_blank"
        >
          Components Documentation
        </a>
        <p>
          In order to use this tool task presenter code must have the following
          template.
        </p>
      </div>
      <div class="row">
        <button
          v-if="!error && !loading"
          id="copy"
          v-clipboard:copy="snippet"
          class="btn btn-link fa fa-clipboard pull-right"
          style="text-decoration: none"
        >
          <span class="copy-font">
            Copy Code
          </span>
        </button>
      </div>
      <div
        v-if="!loading"
        class="row"
      >
        <!-- This line is space sensives it can lose the code format  -->
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <prism language="html">{{ snippet }}</prism>
      </div>
      <div
        v-if="loading"
        class="row"
      >
        <div class="loader" />
      </div>
    </div>
  </div>
</template>
<style>
.copy-font {
  font-family: "Source Sans Pro", sans-serif;
}

.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 75px;
  height: 75px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<script>

import Vue from 'vue';
import Prism from 'vue-prism-component';
Vue.component('CustomRouterLink', {
  props: {
    component: {
      type: Object,
      default: null,
      required: true
    }
  },
  template: `<router-link
        :to="component"
        tag="a"
        class="list-group-item text-color">
        {{ component.params.header }}
        <i
          class="fa fa-chevron-right pull-right"
          style="color: #3AB0D5;"/>
      </router-link>`
});
export default {
  name: 'Questions',
  components: { Prism },
  data () {
    return {
      isPrivate: window.location.hostname.includes('blpprofessional'),
      loading: false,
      error: false,
      snippet: '',
      radioInput: {
        name: 'RADIO_INPUT_FORM',
        params: {
          componentName: 'RADIO_INPUT',
          header: 'Radio Group Input'
        }
      },
      checkboxInput: {
        name: 'CHECKBOX_INPUT_FORM',
        params: {
          componentName: 'CHECKBOX_INPUT',
          header: 'Checkbox Input'
        }
      },
      textInput: {
        name: 'TEXT_INPUT_FORM',
        params: {
          componentName: 'TEXT_INPUT',
          header: 'Text Input'
        }
      },
      table: {
        name: 'TABLE_FORM',
        params: {
          componentName: 'TABLE',
          header: 'Table'
        }
      },
      taskTimer: {
        name: 'TASK_TIMER_FORM',
        params: {
          componentName: 'TASK_TIMER',
          header: 'Task Timer'
        }
      },
      taskPresenter: {
        name: 'TASK_PRESENTER_PREVIEW',
        params: {
          componentName: 'TASK_PRESENTER',
          header: 'Task Presenter'
        }
      },
      submitButton: {
        name: 'SUBMIT_BUTTON_PREVIEW',
        params: {
          componentName: 'SUBMIT_BUTTON',
          header: 'Submit Button'
        }
      },
      buttonRow: {
        name: 'BUTTON_ROW_PREVIEW',
        params: {
          componentName: 'BUTTON_ROW',
          header: 'All buttons'
        }
      },
      submitLastButton: {
        name: 'SUBMIT_LAST_BUTTON_PREVIEW',
        params: {
          componentName: 'SUBMIT_LAST_BUTTON',
          header: 'Submit and Leave Button'
        }
      },
      cancelButton: {
        name: 'CANCEL_BUTTON_PREVIEW',
        params: {
          componentName: 'CANCEL_BUTTON',
          header: 'Cancel Button'
        }
      },
      textTagging: {
        name: 'TEXT_TAGGING_FORM',
        params: {
          componentName: 'TEXT_TAGGING',
          header: 'NLP Enrichment'
        }
      },
      assistantLLM: {
        name: 'ASSISTANT_LLM_FORM',
        params: {
          componentName: 'ASSISTANT_LLM',
          header: 'Assistant LLM'
        }
      },
      dropdownInput: {
        name: 'DROPDOWN_INPUT_FORM',
        params: {
          componentName: 'DROPDOWN_INPUT',
          header: 'Dropdown Input'
        }
      },
      multiselectInput: {
        name: 'MULTISELECT_INPUT_FORM',
        params: {
          componentName: 'MULTISELECT_INPUT',
          header: 'Multiselect Input'
        }
      },
      conditionalDisplay: {
        name: 'CONDITIONAL_DISPLAY_FORM',
        params: {
          componentName: 'CONDITIONAL_DISPLAY',
          header: 'Conditional Display'
        }
      },
      fileUpload: {
        name: 'FILE_UPLOAD_FORM',
        params: {
          componentName: 'FILE_UPLOAD',
          header: 'File Upload'
        }
      },
      inputTextArea: {
        name: 'INPUT_TEXT_AREA_FORM',
        params: {
          componentName: 'INPUT_TEXT_AREA',
          header: 'Input Text Area'
        }
      }
    };
  },
  mounted () {
    this.loading = true;
    this.getTaskPresenterTemplate();
  },
  methods: {
    async getTaskPresenterTemplate () {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('template', 'helper-components');
        url.searchParams.append('clear_template', 'true');
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
        });
        if (response.ok) {
          response.json().then(body => {
            this.snippet = body.form.editor;
            this.loading = false;
          });
        } else {
          console.warn(response);
          this.loading = false;
          this.error = true;
          this.snippet = 'Currently unable to show a start template.';
        }
      } catch (error) {
        console.warn(error);
        this.snippet = 'Currently unable to show a start template.';
        // eslint-disable-next-line no-undef
        pybossaNotify('An error occurred.', true, 'error');
      }
    }
  }
};
</script>
