<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <div class="row">
          <div class="col-md-12">
            <h4>Columns Settings</h4>
            <span />
          </div>
        </div>
        <div class="scroll col-md-12">
          <div class="row">
            <div class="col-md-12">
              <div
                v-for="(col, index) in columns"
                :key="index"
                class="row"
                name="columns"
              >
                <hr
                  v-if="index != 0"
                  size="100px"
                >
                <label> {{ col.id }}</label>
                <button
                  v-if="columns.length > 1"
                  :id="`delete-column-${index}`"
                  class="btn btn-times-delete pull-right fa fa-times"
                  @click="removeColumn(col.id)"
                /><br>
                <label class="block-label">
                  * Column Name | <span class="label-tip">The field within a row where the column's data is read from and written to.</span>
                  <input
                    :id="`column-name-${index}`"
                    :value="col.name"
                    :class="{
                      'form-control form-control-sm': true,
                      'danger-validation': getErrors(`columns[${index}].name`)
                    }"
                    name="name"
                    type="text"
                    @blur="updateColumn(col)"
                    @input="updateColumn(col, 'name', $event.target.value)"
                  >
                </label>
                <div
                  class="danger-validation-text"
                >
                  {{ getErrors(`columns[${index}].name`) }}
                </div>
                <label
                  class="block-label"
                >
                  Column Heading | <span class="label-tip">The heading to display for the column. Uses Column Name if not specified.</span>
                  <input
                    :value="col.header"
                    class="form-control form-control-sm"
                    type="text"
                    @blur="updateColumn(col)"
                    @input="updateColumn(col, 'header', $event.target.value)"
                  >
                </label>
                <label class="block-label">
                  Column Display | <span class="label-tip">The type of input control to display in the column.</span>
                  <select
                    :value="col.component"
                    class="form-control form-control-sm"
                    @blur="updateColumn(col)"
                    @input="updateColumn(col, 'component', $event.target.value)"
                  >
                    <option
                      v-for="component in columnsComponent"
                      :key="component"
                      :value="component"
                    >
                      {{ component }}
                    </option>
                  </select>
                </label>
              </div>
              <br>
            </div>
          </div>
        </div>
        <div class="col-sm-10 col-md-11" />
        <button
          id="addButton"
          class="btn btn-default btn-sm col-sm-2 col-md-1"
          @click="addColumn"
        >
          Add
        </button>
        <div class="row">
          <div class="col-md-12">
            <hr>
            <h4>Table Settings</h4>
            <div
              class="form-group"
            >
              <input
                id="table-enable-editing"
                :checked="enableEditing"
                type="checkbox"
                @input="updateEnableEditing($event.target.checked)"
              >
              <label for="table-enable-editing">
                Enable editing data.
              </label>
            </div>
            <div v-if="enableEditing">
              <div
                class="form-group"
              >
                <input
                  id="table-enable-add"
                  :checked="enableAddRows.value"
                  type="checkbox"
                  @input="updateEnableAddRow({value: $event.target.checked})"
                >
                <label for="table-enable-add">
                  Enable adding and removing rows from the table | <span class="label-tip">**Optional** By default is disable, if its enable the table will add a button for remove/add actions.</span>
                </label>
              </div>

              <div
                class="form-group"
              >
                <label for="table-answer-name">
                  Table Answer field Name | <span class="label-tip">The field where the worker's answers for the table are stored. Can be JSON path like a.b.c.</span>
                </label>
                <input
                  id="table-answer-name"
                  :value="name.value"
                  :class="{
                    'form-control form-control-sm': true,
                    'danger-validation': getErrors(`name`)
                  }"
                  type="text"
                  @input="updateName({value: $event.target.value})"
                  @blur="updateName"
                >
                <div
                  class="danger-validation-text"
                >
                  {{ getErrors(`name`) }}
                </div>
              </div>

              <div
                class="form-group"
              >
                <label for="table-col-id">
                  Column Id | <span class="label-tip">**Optional** This indicate the name of the unique id used by the table in order to update rows. If not define default value is '__col_id'.</span>
                </label>
                <input
                  id="table-col-id"
                  :value="columnId.value"
                  :class="{
                    'form-control form-control-sm': true
                  }"
                  type="text"
                  @input="updateColumnId({value: $event.target.value})"
                >
              </div>

              <div
                class="form-group"
              >
                <input
                  id="table-add-before"
                  :checked="addButtonBeforeTable.value"
                  type="checkbox"
                  @input="updateAddButtonBefore({value: $event.target.checked})"
                >
                <label for="table-add-before">
                  Display add button at top-right corner | <span class="label-tip">Display add row bottom above the table on the right.</span>
                </label>
              </div>
              <div
                class="form-group"
              >
                <input
                  id="table-add-after"
                  :checked="addButtonAfterTable.value"
                  type="checkbox"
                  @input="updateAddButtonAfter({value: $event.target.checked})"
                >
                <label for="table-add-after">
                  Display add button at bottom-right corner | <span class="label-tip">Display add row bottom below the table on the right.</span>
                </label>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <label>Data</label><br>
                <input
                  id="dynamic"
                  :checked="data.isVariable"
                  type="radio"
                  @change="updateData({value: data.value, isVariable: $event.target.value})"
                >
                <label
                  class="col-labels right-padding-radio"
                  for="dynamic"
                >
                  Get table data from source
                </label>
                <input
                  id="static"
                  :checked="!data.isVariable"
                  type="radio"
                  @change="updateData({value: data.value, isVariable: false})"
                >
                <label
                  class="col-labels"
                  for="static"
                >
                  Enter table data manually
                </label>
              </div>
            </div>
            <label
              v-if="data.isVariable"
              for="data-source-name"
              class="col-form-label-md pull-left"
            >
              * Field Data Source Name | <span class="label-tip">The variable in your code that contains the table data. For example, task.info.tableData.</span>
            </label>
            <label
              v-if="!data.isVariable"
              class="col-form-label-md"
            >
              Add Table Data
            </label>
            <input
              v-show="data.isVariable"
              id="data-source-name"
              :value="data.value"
              type="text"
              :class="{
                'form-control form-control-sm': true,
                'danger-validation': getErrors(`data.value`)
              }"
              @blur="updateData"
              @input="updateData({value: $event.target.value, isVariable: data.isVariable})"
            >
            <div
              class="danger-validation-text"
            >
              {{ getErrors(`data.value`) }}
            </div>
            <br>
          </div>
        </div>
        <div
          class="col-md-12"
        >
          <static-data
            v-if="!data.isVariable"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.right-padding-radio {
  padding-right: 10px;
}
</style>

<script>
import '../../../../../css/component_builder.css';
import Vue from 'vue';
import { mapState, mapMutations, mapGetters } from 'vuex';
import StaticData from './StaticData.vue';
import * as types from '../../store/types';
import { ClientTable } from 'vue-tables-2';

Vue.use(ClientTable, {});

export default {
  name: 'TableForms',
  components: { StaticData },
  data () {
    return {
      columnsComponent: ['plain-text', 'text-input', 'checkbox-input', 'other-input', 'input-text-area']
    };
  },
  computed: {
    ...mapGetters({
      columns: types.GET_TABLE_COLUMNS_LIST
    }),
    ...mapState({
      name: (state) => state.table.name,
      data: (state) => state.table.data,
      columnId: (state) => state.table.columnId,
      enableEditing: (state) => state.table.enableEditing,
      enableAddRows: (state) => state.table.enableAddRows,
      addButtonAfterTable: (state) => state.table.addButtonAfterTable,
      addButtonBeforeTable: (state) => state.table.addButtonBeforeTable
    }),

    columnWithComponent: {
      get () {
        return (
          this.columns.filter(col => col.component !== 'plain-text').length > 0
        );
      }
    }
  },
  updated () {
    this.scrollToEnd();
  },
  methods: {
    ...mapMutations({
      'updateColumnId': types.MUTATE_TABLE_COLUMN_ID,
      'updateEnableEditing': types.MUTATE_TABLE_ENABLE_EDITING,
      'updateEnableAddRow': types.MUTATE_TABLE_ENABLE_ADD_ROW,
      'updateAddButtonBefore': types.MUTATE_TABLE_ADD_BUTTON_BEFORE,
      'updateAddButtonAfter': types.MUTATE_TABLE_ADD_BUTTON_AFTER,
      'updateName': types.MUTATE_TABLE_NAME,
      'updateData': types.MUTATE_TABLE_DATA,
      'addColumn': types.MUTATE_TABLE_ADD_COLUMN,
      'removeColumn': types.MUTATE_TABLE_DELETE_COLUMN
    }),
    updateColumn (column, fieldName, value) {
      const newColumn = { ...column };
      if (fieldName) {
        newColumn[fieldName] = value;
      }
      newColumn.isDirty = true;
      this.$store.commit(types.MUTATE_TABLE_UPDATE_COLUMN, newColumn);
      this.scrollToEnd();
    },
    scrollToEnd () {
      var container = document.querySelector('.scroll');
      if (container) {
        var scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight;
      }
    },
    getErrors (key) {
      return (this.$store.getters[types.GET_TABLE_ERRORS][key] || []).join('\n');
    }
  }
};
</script>
