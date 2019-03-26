<template>
  <div class="row">
    <div class="col-md-4">
      <custom-router-link :component="taskPresenter"/>
      <custom-router-link :component="buttonRow"/>
      <custom-router-link :component="submitButton"/>
      <custom-router-link :component="submitLastButton"/>
      <custom-router-link :component="cancelButton"/>
      <custom-router-link :component="timer"/>
      <custom-router-link :component="textInput"/>
      <custom-router-link :component="checkboxInput"/>
      <custom-router-link :component="table"/>
    </div>
    <div class="col-md-8">
      <div class="row">
        <h3 class="text-color">Guide</h3>
        <a
          href="https://bbgithub.dev.bloomberg.com/GIGwork/pybossa-vue/wiki/Pybossa-Presenter-Components#include-the-files"
          target="_blank">Components Documentation</a>
        <p> In order to use this tool task presenter code must have the following template.</p>
      </div>
      <div class="row">
        <button
          v-clipboard:copy="snippet"
          v-if="!error && !loading"
          id="copy"
          class="btn btn-link fa fa-clipboard pull-right"
          style="text-decoration: none"><span class="copy-font"> Copy Code</span>
      </button></div>
      <div class="row">
        <prism
          v-if="!loading"
          language="html">{{ snippet }}</prism>
      </div>
      <div
        v-if="loading"
        class="row">
        <div class="loader"/>
      </div>
    </div>
  </div>
</template>
<style>

.copy-font {
    font-family:"Source Sans Pro",sans-serif;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
<script>

import Vue from 'vue'
import Prism from 'vue-prism-component'
Vue.component('custom-router-link', {
    props: { component: {
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
})
export default {
    name: 'Questions',
    components: {Prism},
    data () {
        return {
            loading: false,
            error: false,
            snippet: '',
            checkboxInput: {
                name: 'CHECKBOX_INPUT_FORM',
                params: {
                    componentName: 'CHECKBOX_INPUT',
                    header: 'Checkbox Input' }
            },
            textInput: {
                name: 'TEXT_INPUT_FORM',
                params: {
                    componentName: 'TEXT_INPUT',
                    header: 'Text Input' }
            },
            table: {
                name: 'TABLE_FORM',
                params: {
                    componentName: 'TABLE',
                    header: 'Table' }
            },
            timer: {
                name: 'TIMER_PREVIEW',
                params: {
                    componentName: 'TIMER',
                    header: 'Timer' }
            },
            taskPresenter: {
                name: 'TASK_PRESENTER_PREVIEW',
                params: {
                    componentName: 'TASK_PRESENTER',
                    header: 'Task Presenter' }
            },
            submitButton: {
                name: 'SUBMIT_BUTTON_PREVIEW',
                params: {
                    componentName: 'SUBMIT_BUTTON',
                    header: 'Submit Button' }
            },
            buttonRow: {
                name: 'BUTTON_ROW_PREVIEW',
                params: {
                    componentName: 'BUTTON_ROW',
                    header: 'All buttons' }
            },
            submitLastButton: {
                name: 'SUBMIT_LAST_BUTTON_PREVIEW',
                params: {
                    componentName: 'SUBMIT_LAST_BUTTON',
                    header: 'Submit and Leave Button' }
            },
            cancelButton: {
                name: 'CANCEL_BUTTON_PREVIEW',
                params: {
                    componentName: 'CANCEL_BUTTON',
                    header: 'Cancel Button' }
            }
        }
    },
    mounted: function () {
        this.loading = true
        this.getTaskPresenterTemplate()
    },
    methods: {
        async getTaskPresenterTemplate () {
            try {
                const url = new URL(window.location.href)
                url.searchParams.set('template', 'helper-components')
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                if (response.ok) {
                    response.json().then((body) => {
                        this.snippet = body.form.editor
                        this.loading = false
                    })
                } else {
                    console.warn(response)
                    this.loading = false
                    this.error = true
                    this.snippet = 'Currently unable to show a start template.'
                }
            } catch (error) {
                console.warn(error)
                pybossaNotify('An error occurred.', true, 'error')
            }
        }
    }
}
</script>
