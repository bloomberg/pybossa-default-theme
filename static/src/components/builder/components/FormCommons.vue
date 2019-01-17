<template>
  <div class="row">
    <div class="col-md-12">
      <br>
      <div class= "row">
        <form >
          <div class="form-row">
            <div class="form-group col-md-12">
              <input
                id="add-label"
                v-model="form.labelAdded"
                type="checkbox">
              <label for="add-label">Add Label</label>
              <input
                v-if = "form.labelAdded === true"
                id="component-label"
                v-model= "form.label.value"
                class="form-control form-control-sm"
                type="text" >
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label
                for = "pyb-answer"
                class= "col-form-label-sm" >Answer field name</label>
              <input
                id="pyb-answer"
                v-model= "form['pyb-answer'].value"
                class="form-control form-control-sm"
                type="text">
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '../store/types'
export default {
    name: 'FormCommons',
    computed: {
        form: {
            get () {
                const getFormType = types['GET_' + this.$route.params.componentName + '_FORM']
                return this.$store.getters[getFormType]
            },
            set (value) {
                const updateFormType = types['UPDATE_' + this.$route.params.componentName + '_FORM']
                this.$store.dispatch(updateFormType, value)
            }
        }
    }

}
</script>
