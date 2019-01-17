<template>
  <div class = "row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
          <h4>Task presenter code</h4>
          <span
            v-if="!isValidForm"
            class="message-color">
            ** Component properties are not complete, please review form **
          </span>
          <prism language="html">{{ snippet }}</prism>
          <br>
          <h4>Preview</h4>
          <form class="form-horizontal">
            <label>{{ form.label.value }}</label>
            <ComponentRender
              :selected-component = "componentsNames[$route.params.componentName]"
              :form = "form"/>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.message-color{
    color:crimson
}
</style>

<script>
import 'prismjs'
import 'prismjs/themes/prism.css'
import Prism from 'vue-prism-component'
import ComponentRender from './ComponentRender'
import components from 'test-component.vue'
import * as types from '../store/types'

export default {
    components: {
        ...components,
        ComponentRender,
        Prism
    },
    data () {
        return {
            componentsNames: { TEXT_INPUT: 'text-input',
                CHECKBOX_INPUT: 'checkbox-input',
                TABLE: 'table-creator' }
        }
    },
    computed: {
        form: {
            get () {
                const getFormType = types['GET_' + this.$route.params.componentName + '_FORM']
                return this.$store.getters[getFormType]
            }
        },
        snippet: {
            get () {
                const getSnippetType = types['GET_' + this.$route.params.componentName + '_SNIPPET']
                return this.$store.getters[getSnippetType]
            }
        },
        isValidForm: {
            get () {
                const getFormValidType =
                    types['GET_' + this.$route.params.componentName + '_FORM_VALID']
                const isValidForm = this.$store.getters[getFormValidType]
                return isValidForm
            }
        },
    }
}
</script>
