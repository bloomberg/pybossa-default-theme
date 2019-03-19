/* eslint-disable vue/require-prop-types */
<template>
  <div class="row">
    <v-client-table
      ref ="staticDataTable"
      :data="form.data.list"
      :columns="columns"
      :options = "options"
      name="staticDataTable">
      <div slot = "afterTable">
        <button
          class="btn btn-sm btn-default pull-right"
          @click="addRow">Add Row</button>
      </div>
      <template
        v-for="(c,i) in form.columns"
        slot-scope="props"
        :slot = "c.id"
        class="col-md-12">
        <div
          v-if="c.component === 'plain-text'"
          :key="i"
          class="">
          <input
            id="table-name"
            v-model = "props.row[c.id]"
            class="form-control form-control-sm"
            type="text"
            @input="editRow(props.row)" >
        </div>
        <div
          v-else
          :key="i">Answer Column</div>
      </template>
      <template
        slot = "hide-delete"
        slot-scope="props">
        <button
          class="btn btn-link fa fa-times"
          @click="removeRow(props.row)"/>
      </template>
    </v-client-table>
  </div>
</template>
<style>
</style>

<script>
import Vue from 'vue'
import * as types from '../../store/types'
import { ClientTable } from 'vue-tables-2'
import utils from '../../utils'

Vue.use(ClientTable, { })
export default {
    name: 'TableCreator',
    data () {
        return {
            row: {
                type: Object,
                default: {}
            },
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
        options: {
            get () {
                const options = this.form.options.value
                options.headings['hide-delete'] = 'Delete'
                options.filterByColumn = false
                options.filterable = []
                options.sortable = []
                options.texts = { filter: '', count: '' }

                return options
            }
        },
        columns: {
            get () {
                return [...['hide-delete'], ...this.form.columns.map((col) => col.id)]
            }
        }

    },
    methods: {
        editRow: function (row) {
            const index = this.form.data.list.findIndex((r) => r.staticDataId === row.staticDataId)
            this.form.data.list[index] = {...row}
            this.$store.dispatch(types.UPDATE_TABLE_FORM, this.form)
        },
        addRow: function () {
            this.form.data.list.push(this.getRow())
        },
        removeRow: function (row) {
            const index = this.form.data.list.findIndex((r) => r.staticDataId === row.staticDataId)
            this.form.data.list.splice(index, 1)
        },
        getRow: function () {
            const row = { staticDataId: utils.uniqueID() }
            this.columns.forEach(function (col) {
                row[col] = ''
            })
            return row
        }
    }
}
</script>
