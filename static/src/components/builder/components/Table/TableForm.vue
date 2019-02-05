<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <div
          v-if="columnWithComponent"
          class="form-group">
          <label for="add-label">* Table Answer field Name</label>
          <input
            id="table-name"
            v-model= "form.name.value"
            :class="{'form-control form-control-sm': true,
                     'danger-validation': ((form.name.value === '' && columnWithComponent)
            || (form.name.value === '' && form.name.dirty)) }"
            type="text"
            @click="form.name.dirty =true"
            @blur="form.name.dirty =true">
          <p v-if="form.name.value === '' && form.name.dirty">This field is required!</p>
        </div>
        <label
          v-if="columnWithComponent"
          class= "col-form-label-md"
        >* Select a unique id column </label>
        <select
          v-if="columnWithComponent"
          v-model="columnId"
          :class="{'form-control form-control-sm': true,
                   'danger-validation': (columnId === 'default' ) }">
          <option
            :value="null"
            disabled>Select Column Id</option>
          <option
            v-for="e in columns"
            :key = "e"
            :value="e">
            {{ e }}
          </option>
        </select>
        <input
          v-if="columnWithComponent"
          v-model="hideColumnId"
          type="checkbox">
        <label v-if="columnWithComponent">Hide column Id </label>
        <div class="row">
          <div class="col-md-12">
            <label>Columns Settings</label>
            <span/>
          </div>
        </div>
        <vue-custom-scrollbar
          :settings="settings"
          class="scroll-area">
          <div class="row">
            <div class="col-md-1"/>
            <div class="col-md-10">
              <div
                v-for="(col, index) in form.columns"
                :key="index"
                class="row"
                name="columns">
                <hr
                  v-if="index !=0"
                  size="100px">
                <label>Column #{{ index + 1 }}</label>
                <button
                  v-if="
                  form.columns.length > 1"
                  id="column-delete"
                  class="btn btn-times-delete pull-right fa fa-times"
                  style="text-decoration: none"
                  @click="removeColumn(col)"/><br>
                <label class="col-lables">* Column Name</label>
                <input
                  v-model= "col.name"
                  :class="{'form-control form-control-sm': true,
                           'danger-validation': (col.name === '' && col.dirty) }"
                  name="name"
                  type="text"
                  @blur="col.dirty =true"
                  @click="col.dirty =true">
                <p v-if="col.name === '' && col.dirty ">This field is required!</p>
                <label class="col-lables" >Column Heading</label>
                <input
                  v-model= "col.header"
                  class="form-control form-control-sm"
                  type="text" >
                <label class="col-lables">Column Display</label>
                <select
                  v-model= "col.component"
                  class="form-control form-control-sm"
                  @change="updateColumns">
                  <option
                    v-for="component in columnsComponent"
                    :key = "component"
                    :value="component">
                    {{ component }}
                  </option>
                </select>
                <input
                  v-model="col.filterable"
                  type="checkbox">
                <label class="col-lables" >Filterable</label>
                <input
                  v-model="col.sortable"
                  type="checkbox">
                <label class="col-lables">Sortable</label>
              </div>
            </div>
          </div>
          <button
            id="add"
            class="btn btn-sm btn-default pull-right"
            @click="addColumn">Add</button>
        </vue-custom-scrollbar>
        <hr>
        <label
          class= "col-form-label-md">* Table Data</label>
        <div class="pull-right">
          <input
            id="table-data-isVariable"
            v-model="form.data.isVariable"
            type="checkbox">
          <label
            for="table-data-isVariable">Table data source is dynamic</label>
        </div>
        <br>
        <label
          v-if="form.data.isVariable"
          class= "col-form-label-md">Field Data Source Name</label>
        <input
          v-if="form.data.isVariable"
          v-model= "form.data.value"
          class="form-control form-control-sm"
          type="text" >
        <br>
      </div>
    </div>
    <div class="col-md-12">
      <static-data v-if="!form.data.isVariable"/>
    </div>
  </div>
</template>

<style >
.col-lables {
    color: black;
    font-size: 16px;
    font-weight: 400;
}
.scroll-area {
  position: relative;
  margin: auto;
  width: flex;
  min-height: 300px;
  max-height: 600px;
}
.btn-times-delete{
    color:#d9534f
}
.danger-validation {
    border-color: #d9534f
}
</style>

<script>
import Vue from 'vue'
import FormCommons from '../FormCommons.vue'
import StaticData from './StaticData.vue'
import VueCustomScrollbar from 'vue-custom-scrollbar'
import * as types from '../../store/types'
import { ClientTable } from 'vue-tables-2'
import { getColumnObject } from '../../store/modules/table'

Vue.use(ClientTable, { })

export default {
    name: 'TableForms',
    components: { FormCommons, VueCustomScrollbar, StaticData },
    data () {
        return {
            columnsComponent: [ 'plain-text', 'text-input', 'checkbox-input' ],
            settings: {
                maxScrollbarLength: 60,
                suppressScrollX: true
            },
            row: {},
            isVariable: false,
            isFormValid: true
        }
    },
    computed: {
        form: {
            get () {
                const form = this.$store.getters[types.GET_TABLE_FORM]
                return form
            },
            set (value) {
                this.$store.dispatch(types.UPDATE_TABLE_FORM, value)
            }
        },
        columnWithComponent: {
            get () {
                return (this.form.columns.filter(
                    (col) => col.component !== 'plain-text').length > 0)
            }
        },

        inValidColumns: {
            get () {
                return !(this.form.columns.length === this.form.columns.filter(
                    (col) => col.name !== '').length)
            }
        },
        columns: {
            get () {
                return [...this.form.columns.filter((col) => col.component === 'plain-text' &&
                col.name !== '').map((col) => col.name)]
            }
        },
        hideColumnId: {
            get () {
                const columnId = this.form.columns.filter((col) => col.isColumnId === true)
                return columnId.length > 0 ? columnId[0].hideColumnId : false
            },
            set (value) {
                const column = this.form.columns.filter((col) => col.isColumnId === true)
                column[0].hideColumnId = value
            }
        },
        columnId: {
            get () {
                const columnId = this.form.columns.filter((col) => col.isColumnId === true)
                return columnId.length > 0 ? columnId[0].name : 'default'
            },
            set (value) {
                this.form.columns.forEach((col) => {
                    if (col.name === value) {
                        col.isColumnId = true
                    } else {
                        col.isColumnId = false
                    }
                })
            }
        },
    },
    methods: {
        updateColumns: function () {
            this.$store.dispatch(types.UPDATE_TABLE_COLUMNS_FORM, this.form)
        },
        addRow: function () {
            this.form.data.list.push(this.row)
            this.$store.dispatch(types.UPDATE_TABLE_FORM, this.form)
        },
        getColumnObject: function () {
            return {
                name: '',
                header: '',
                component: 'plain-text',
                filterable: false,
                sortable: false,
                isColumnId: false,
                hideColumnId: false
            }
        },
        addColumn: function () {
            this.form.columns.push(getColumnObject())
            this.$store.dispatch(types.UPDATE_TABLE_FORM, this.form)
        },
        removeColumn: function (colToRemove) {
            this.form.columns = this.form.columns.filter((col) => col !== colToRemove)
            this.form.data.list.forEach(function (row) {
                delete row[colToRemove.name]
            })
            this.$store.dispatch(types.UPDATE_TABLE_FORM, this.form)
        },

    }

}
</script>

