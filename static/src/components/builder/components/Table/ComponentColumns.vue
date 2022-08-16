<script>
import Vue from 'vue';
import components from '@dtwebservices/task-presenter-components';
import { ClientTable } from 'vue-tables-2';

Vue.use(ClientTable, {});

export default {
  name: 'ComponentColumns',
  components: { ...components },
  props: {
    form: {
      type: Object,
      default: null
    },
    selectedComponent: {
      type: String,
      default: null
    }
  },
  methods: {
    renderFunctions () {
      if (this.selectedComponent === 'text-input' || this.selectedComponent === 'input-text-area') {
        return {
          props: {
            row: this.form['row'],
            'pyb-table-answer': this.form['pyb-table-answer']
          }
        };
      } else if (this.selectedComponent === 'checkbox-input') {
        return {
          props: {
            row: this.form['row'],
            'initial-value': false,
            'pyb-table-answer': this.form['pyb-table-answer']
          }
        };
      }
    }
  },
  render (h) {
    return h(this.selectedComponent, {
      name: 'ComponentColumns',
      ...this.renderFunctions()
    });
  }
};
</script>

<style>
.form-group{
    margin-left: 0px!important;
    margin-right: 0px!important;
}
</style>
