<template>
  <div class="row">
    <h4
    >Text Input Settings</h4>
    <div
      v-if="form"
      class="row">
      <div class="col-md-12">
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
  </div>  </div>
</template>

<script>
import * as types from '../../store/types'

export default {
    name: 'TextInputForm',
    computed: {
        form: {
            get () {
                return this.$store.getters[types.GET_TEXT_INPUT_FORM]
            },
            set (value) {
                this.$store.dispatch(types.UPDATE_TEXT_INPUT_FORM, value)
            }
        }
    }
}
</script>
