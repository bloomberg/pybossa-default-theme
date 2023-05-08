<script>
import Vue from 'vue';
import components from '@dtwebservices/task-presenter-components';
import TableCreator from '../Table/TableCreator.vue';
import CheckboxCreator from '../CheckboxInput/CheckboxCreator.vue';
import ConditionaldisplayCreator from '../ConditionalDisplay/ConditionalDisplayCreator.vue';

import { ClientTable } from 'vue-tables-2';
import componentStates from './states';

Vue.use(ClientTable, {});

export default {
  name: 'ComponentRender',
  components: { ...components, TableCreator, CheckboxCreator, ConditionaldisplayCreator },
  props: {
    form: {
      type: Object,
      default () {
        return { label: {}, isValidForm: true };
      }
    },
    selectedComponent: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      inProgress: true
    };
  },

  async mounted () {
    const { intervalSeconds, states } = componentStates[this.selectedComponent] || componentStates.default;

    // If there is just a single state then set it and return.
    if (!Array.isArray(states)) {
      return this.$store.commit(
        'TASK_PRESENTER/MERGE_STATE',
        states
      );
    }

    // Otherwise loop over all the states forever.
    const it = iterator();

    while (this.inProgress) {
      this.$store.commit(
        'TASK_PRESENTER/MERGE_STATE',
        it.next().value
      );

      await seconds(intervalSeconds);
    }

    function* iterator () {
      while (true) {
        yield * states;
      }
    }

    function seconds (num) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, num * 1000);
      });
    }
  },

  beforeDestroy () {
    this.inProgress = false;
  },

  methods: {
    renderFunctions () {
      if (this.selectedComponent === 'text-input') {
        return {
          name: 'text-input',
          attrs: { id: this.id, type: this.form['type'] },
          props: { 'pyb-answer': this.form['pyb-answer'] }
        };
      } else if (this.selectedComponent === 'file-upload') {
        return {
          name: 'file-upload',
          attrs: { id: this.id },
          props: { pybanswer: this.form.pybanswer, fileName: this.form.fileName }
        };
      } else if (this.selectedComponent === 'checkbox-creator') {
        return {
          name: 'checkbox-creator',
          attrs: { id: 'test' },
          props: { checkboxList: this.form.checkboxList }
        };
      } else if (this.selectedComponent === 'radio-group-input') {
        let choices = {};
        this.form.radioList.forEach(radio => {
          choices[radio.value] = radio.label;
        });
        return {
          name: 'radio-group-input',
          props: {
            choices,
            pybAnswer: this.form.pybAnswer,
            initialValue: this.form.initialValue,
            name: this.form.name
          }
        };
      } else if (this.selectedComponent === 'dropdown-input') {
        return {
          name: 'dropdown-input',
          props: {
            pybAnswer: this.form.pybAnswer,
            choices: this.form.choices,
            initialValue: this.form.initialValue
          }
        };
      } else if (this.selectedComponent === 'multi-select-input') {
        return {
          name: 'multi-select-input',
          props: {
            pybAnswer: this.form.pybAnswer,
            choices: Object.values(this.form.choices),
            initialValue: this.form.initialValue
          }
        };
      } else if (this.selectedComponent === 'text-tagging') {
        return {
          name: 'text-tagging',
          props: {
            readOnly: this.form.readOnly,
            pybAnswer: this.form.pybAnswer,
            tags: this.form.tags,
            text: this.form.text.preview,
            nlpnedEntities: this.form.entities.preview,
            confidenceThreshold: this.form.confidenceThreshold
          }
        };
      } else if (this.selectedComponent === 'table-creator') {
        const data = this.form.data.isVariable
          ? [{}]
          : this.form.data.list;
        return {
          name: 'table-creator',
          props: {
            form: {
              columns: this.form.columns,
              data,
              options: { ...this.form.options },
              name: this.form.name,
              columnId: this.form.columnId,
              rowObject: this.form.rowObject,
              enableAddRows: this.form.enableAddRows,
              addButtonAfterTable: this.form.addButtonAfterTable,
              addButtonBeforeTable: this.form.addButtonBeforeTable
            }
          }
        };
      } else if (this.selectedComponent === 'task-timer') {
        return {
          name: 'task-timer',
          attrs: { lock: `${this.form.showLock}` }
        };
      } else if (this.selectedComponent === 'task-presenter') {
        return {
          name: 'task-presenter',
          attrs: { 'allow-save-work': `${this.form.allowSaveWork}` }
        };
      } else if (this.selectedComponent === 'input-text-area') {
        return {
          name: 'input-text-area',
          attrs: { id: this.id, 'rows': this.form['rows'], 'cols': this.form['cols'] },
          props: { 'pyb-answer': this.form['pyb-answer'] }
        };
      }
      return {};
    }
  },
  render (h) {
    if (this.form.isValidForm.isValid) {
      return h(this.selectedComponent, {
        ...this.renderFunctions()
      });
    }

    return null;
  }
};
</script>
