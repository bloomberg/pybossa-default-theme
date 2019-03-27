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
                v-for="(col, index) in form.columns"
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
                  v-if="form.columns.length > 1"
                  id="column-delete"
                  class="btn btn-times-delete pull-right fa fa-times"
                  @click="removeColumn(col)"
                /><br>
                <label class="col-lables">
                  * Column Name
                </label>
                <input
                  v-model="col.name"
                  :class="{
                    'form-control form-control-sm': true,
                    'danger-validation': invalidColumn(col)
                  }"
                  name="name"
                  type="text"
                  @blur="col.dirty = true"
                  @click="col.dirty = true"
                >
                <p v-if="col.name === '' && col.dirty">
                  This field is required!
                </p>
                <label class="col-lables">
                  Column Heading
                </label>
                <input
                  v-model="col.header"
                  class="form-control form-control-sm"
                  type="text"
                >
                <label class="col-lables">
                  Column Display
                </label>
                <select
                  v-model="col.component"
                  class="form-control form-control-sm"
                >
                  <option
                    v-for="component in columnsComponent"
                    :key="component"
                    :value="component"
                  >
                    {{ component }}
                  </option>
                </select>
              </div>
              <br>
            </div>
          </div>
        </div>
        <div class="col-sm-10 col-md-11" />
        <button
          id="add"
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
              v-if="columnWithComponent"
              class="form-group"
            >
              <label for="add-label">
                * Table Answer field Name
              </label>
              <input
                id="table-name"
                v-model="form.name.value"
                :class="{
                  'form-control form-control-sm': true,
                  'danger-validation': form.name.value === ''
                }"
                type="text"
                @click="form.name.dirty = true"
                @blur="form.name.dirty = true"
              >
              <p v-if="form.name.value === '' && form.name.dirty">
                This field is required!
              </p>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <label>Data</label><br>
                <input
                  id="dynamic"
                  v-model="form.data.isVariable"
                  :value="true"
                  type="radio"
                >
                <label
                  class="col-lables right-padding-radio"
                  for="dynamic"
                >
                  Get table data from source
                </label>
                <input
                  id="static"
                  v-model="form.data.isVariable"
                  :value="false"
                  type="radio"
                >
                <label
                  class="col-lables"
                  for="static"
                >
                  Enter table data manually
                </label>
              </div>
            </div>
            <label
              v-if="form.data.isVariable"
              class="col-form-label-md pull-left"
            >
              * Field Data Source Name
            </label>
            <label
              v-if="!form.data.isVariable"
              class="col-form-label-md"
            >
              Add Table Data
            </label>
            <input
              v-if="form.data.isVariable"
              v-model="form.data.value"
              class="form-control form-control-sm"
              type="text"
            >
            <br>
          </div>
        </div>
        <div class="col-md-12">
          <static-data v-if="!form.data.isVariable" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.col-lables {
  color: black;
  font-size: 16px;
  font-weight: 400;
}

.btn-times-delete {
  color: #d9534f;
}
.btn-times-delete:hover {
  color: #d9534f;
}
.danger-validation {
  border-color: #d9534f;
}
.scroll {
  width: flex;
  max-height: 300px;
  overflow-x: hidden;
  max-height: 600px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.right-padding-radio {
  padding-right: 10px;
}
</style>

<script>
import Vue from 'vue';
import StaticData from './StaticData.vue';
import * as types from '../../store/types';
import { ClientTable } from 'vue-tables-2';
import { getColumnObject } from '../../store/modules/table';

Vue.use(ClientTable, {});

export default {
  name: 'TableForms',
  components: { StaticData },
  data () {
    return {
      columnsComponent: ['plain-text', 'text-input', 'checkbox-input']
    };
  },
  computed: {
    form: {
      get () {
        const form = this.$store.getters[types.GET_TABLE_FORM];
        return form;
      },
      set (value) {
        this.$store.dispatch(types.UPDATE_TABLE_FORM, value);
      }
    },
    columnWithComponent: {
      get () {
        return (
          this.form.columns.filter(col => col.component !== 'plain-text')
            .length > 0
        );
      }
    },

    inValidColumns: {
      get () {
        return !(
          this.form.columns.length ===
          this.form.columns.filter(col => col.name !== '').length
        );
      }
    },
    columns: {
      get () {
        return [
          ...this.form.columns
            .filter(col => col.component === 'plain-text' && col.name !== '')
            .map(col => col.name)
        ];
      }
    }
  },
  mounted () {
    this.scrollToEnd();
  },
  updated () {
    this.scrollToEnd();
  },
  methods: {
    scrollToEnd () {
      var container = document.querySelector('.scroll');
      var scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    },
    addRow: function () {
      this.form.data.list.push({});
      this.$store.dispatch(types.UPDATE_TABLE_FORM, this.form);
      this.scrollToEnd();
    },
    addColumn: function () {
      this.form.colCounter++;
      this.form.columns.push(getColumnObject(this.form.colCounter));
      this.$store.dispatch(types.UPDATE_TABLE_FORM, this.form);
      this.scrollToEnd();
    },
    removeColumn: function (colToRemove) {
      this.form.columns = this.form.columns.filter(col => col !== colToRemove);
      this.form.data.list.forEach(function (row) {
        delete row[colToRemove.id];
      });
      this.$store.dispatch(types.UPDATE_TABLE_FORM, this.form);
    },
    invalidColumn: function (col) {
      const cols = this.form.columns.filter(c => c.name === col.name);
      return (
        cols.length > 1 ||
        (this.form.columns.length > 1 && col.name === '') ||
        (col.name === '' && col.dirty)
      );
    }
  }
};
</script>
