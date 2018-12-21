<template>
  <div class = "row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
          <h4>Task presenter code</h4>
          <prism language="html">{{ snippet }}</prism>
          <br>
          <h4>Preview</h4>
          <form class="form-horizontal">
            <label :for="form.id.value">{{ form.label.value }}</label>
            <ComponentRender
              :selected-component = "componentsNames[this.$route.params.componentName]"
              :form = "form"/>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

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
            componentsNames: { TEXT_INPUT: 'text-input', CHECKBOX_INPUT: 'checkbox-input' }
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
        }
    }

}
</script>
