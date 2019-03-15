<template>
  <div class="row">
    <h4
    >Checkbox Settings</h4>
    <input
      id="add-label"
      v-model="form.labelAdded"
      type="checkbox">
    <label for="add-label">Add Checkbox Group Label</label>
    <input
      v-if = "form.labelAdded === true"
      id="component-label"
      v-model= "form.label.value"
      class="form-control form-control-sm"
      type="text" >
    <hr>
    <h4 for="add-label">Checkbox Group</h4>
    <div class="scroll col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div
            v-for="(checkbox, index) in form.checkboxList"
            :key="index"
            class="row"
            name="columns">
            <hr
              v-if="index !=0"
              size="100px">
            <label>Checkbox #{{ index + 1 }}</label>
            <button
              v-if="
              form.checkboxList.length > 1"
              id="column-delete"
              class="btn btn-times-delete pull-right fa fa-times"
              @click="removeCheckbox(checkbox)"/><br>

            <h5 for="component-label">Checkbox Description Label</h5>
            <input
              id="component-label"
              v-model= "checkbox.label.value"
              class="form-control form-control-sm"
              type="text" >
            <h5
              for = "pyb-answer"
              class= "col-form-label-sm" >Answer field name</h5>
            <input
              id="pyb-answer"
              v-model= "checkbox['pyb-answer'].value"
              class="form-control form-control-sm"
              type="text">
            <h5
              class= "col-form-label-md"
              for = "initial-value" >Initial Value</h5>
            <select
              id ="initial-value"
              v-model= "checkbox['initial-value'].value"
              class="form-control form-control-sm" >
              <option
                v-for="e in booleanValues"
                :key = "e"
                :value="e">
                {{ e }}
              </option>
            </select>
          </div>
          <br>
        </div>
      </div>
    </div>
    <div class="col-sm-10 col-md-11"/>
    <button
      id="add"
      class="btn btn-default btn-sm col-sm-2 col-md-1"
      @click="addCheckbox">Add</button>
  </div>
</template>
<style>
.col-lables {
    color: black;
    font-size: 16px;
    font-weight: 400;
}

.scroll{
    width: flex;
    max-height: 300px;
    overflow-x: hidden;
    max-height: 600px;
    overflow-y: scroll;
    margin-bottom: 20px;
}

</style>
<script>
import * as types from '../../store/types'
import { getCheckboxObject } from '../../store/modules/checkboxInput'

export default {
    name: 'TextInputForm',
    components: {},
    data () {
        return {
            booleanValues: [false, true]
        }
    },
    computed: {
        form: {
            get () {
                return this.$store.getters[types.GET_CHECKBOX_INPUT_FORM]
            },
            set (value) {
                this.$store.dispatch(types.UPDATE_CHECKBOX_INPUT_FORM, value)
            }
        },
        snippet: {
            get () {
                return this.$store.getters[types.GET_CHECKBOX_INPUT_SNIPPET]
            }
        }
    },
    mounted () {
        this.scrollToEnd()
    },
    updated () {
        this.scrollToEnd()
    },
    methods: {
        scrollToEnd () {
            var container = document.querySelector('.scroll')
            var scrollHeight = container.scrollHeight
            container.scrollTop = scrollHeight
        },
        updateColumns: function () {
            this.$store.dispatch(types.UPDATE_CHECKBOX_INPUT_FORM, this.form)
        },
        addCheckbox: function () {
            this.form.checkboxList.push(getCheckboxObject())
            this.$store.dispatch(types.UPDATE_CHECKBOX_INPUT_FORM, this.form)
            this.scrollToEnd()
        },
        removeCheckbox: function (checkboxToRemove) {
            this.form.checkboxList = this.form.checkboxList.filter((checkbox) => checkbox !== checkboxToRemove)
            this.$store.dispatch(types.UPDATE_CHECKBOX_INPUT_FORM, this.form)
        },

    }
}
</script>
