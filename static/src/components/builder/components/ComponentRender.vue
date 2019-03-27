<script>
import Vue from 'vue';
import components from '@dtwebservices/task-presenter-components';
import TableCreator from './Table/TableCreator.vue';
import CheckboxCreator from './CheckboxInput/CheckboxCreator.vue';
import { ClientTable } from 'vue-tables-2';
import utils from '../utils';

Vue.component('static-task-timer', {
  template: '<p>Time Remaining: 59 minute s, 43 seconds</p>'
});

Vue.use(ClientTable, {});
export const getOptions = function (columnDetails) {
  const options = utils.getOptions(columnDetails);
  options.filterByColumn = false;
  options.filterable = [];
  options.sortable = [];
  options.texts = { filter: '', count: '' };

  return options;
};

export default {
  name: 'ComponentRender',
  components: { ...components, TableCreator, CheckboxCreator },
  props: {
    form: {
      type: Object,
      default: function () {
        return { label: {}, isValidForm: true };
      }
    },
    selectedComponent: {
      type: String,
      default: null
    }
  },
  methods: {
    renderFunctions: function () {
      if (this.selectedComponent === 'text-input') {
        return {
          name: 'text-input',
          attrs: { id: this.form.id.value },
          props: { 'pyb-answer': this.form['pyb-answer'].value }
        };
      } else if (this.selectedComponent === 'checkbox-creator') {
        return {
          name: 'checkbox-creator',
          attrs: { id: 'test' },
          props: { checkboxList: this.form.checkboxList }
        };
      } else if (this.selectedComponent === 'table-creator') {
        const data = this.form.data.isVariable
          ? [{}]
          : utils.getTableData(this.form);
        return {
          name: 'table-creator',
          props: {
            form: {
              columns: this.form.columns,
              data,
              options: getOptions(this.form.columns),
              name: 'TableCreator'
            }
          }
        };
      }
      return {};
    }
  },
  render (h) {
    if (this.form.isValidForm) {
      return h(this.selectedComponent, {
        ...this.renderFunctions()
      });
    } else {
      return h('span', null, 'No preview available');
    }
  }
};
</script>
