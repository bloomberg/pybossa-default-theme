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
        <a href="https://bbgithub.dev.bloomberg.com/GIGwork/gigwork.bbgithub.dev.bloomberg.com/blob/docs/engineering-documentation.rst">Components Documentation</a>
        <p class="red-alert"> In order to use this tool your task presenter code must have the following template.</p>
      </div>
      <button
        v-clipboard:copy="snippet"
        id="copy"
        class="btn btn-link fa fa-clipboard pull-right"
        style="text-decoration: none"><span> Copy Code</span></button>
    </div>
    <prism language="html">{{ snippet }}</prism>
  </div>
</template>
<style>
.red-alert{
    color:#d9534f
}</style>
<script>

import Vue from 'vue'
import Prism from 'vue-prism-component'
import utils from '.././utils'
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
    computed: {
        snippet: function () {
            return utils.getHelperComponentCode('TASK_PRESENTER_START_TEMPLATE').trim()
        }
    },
}
</script>
