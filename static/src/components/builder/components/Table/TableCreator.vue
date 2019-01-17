<template>
  <div
    class="row">
    <table-element
      :data="data"
      :columns="columns"
      :name="form.name"
      :options="form.options"
      :column-id= "columnId.name"
      :id-visible="columnId.idVisible"
    >
      <template
        v-for="(c,i) in form.columns"
        slot-scope="props"
        :slot = "c.name"
        class="form-group col-md-12">
        <ComponentColumns
          v-if="c.component !== 'plain-text'"
          :key = "i"
          :selected-component = "c.component"
          :form = "{row:
                      props.row,'pyb-table-answer': props.row,
                    'initial-value': false}"/>
        <div
          v-else
          :key = "i">{{ props.row[c.name] }}</div>
      </template>
    </table-element>
  </div>
</template>

<script>
import components from 'test-component.vue'
import ComponentColumns from './ComponentColumns.vue'
import ComponentRender from '../ComponentRender.vue'
export default {
    name: 'TableCreator',
    components: { ...components, ComponentColumns, ComponentRender },
    props: {
        form: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            columnsDetails: {name: 'text-input', link: 'checkbox-input'}
        }
    },
    computed: {
        formTest: function () {
            return {name: 'TEXT_INPUT'}
        },
        columns: function () {
            return this.form.columns.map((col) => col.name)
        },
        data: function () {
            return this.form.data.isVariable ? [{}] : this.form.data.list
        },
        columnId: function () {
            const columnId = {}
            this.form.columns.forEach(function (col) {
                if (col.isColumnId) {
                    columnId.name = col.name
                    columnId.idVisible = !col.hideColumnId
                }
            })
            return columnId
        }
    }
}
</script>
