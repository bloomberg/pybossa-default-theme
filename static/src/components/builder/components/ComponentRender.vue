<script>
import Vue from 'vue'
import components from 'test-component.vue'
import TableCreator from './Table/TableCreator.vue'
import { ClientTable } from 'vue-tables-2'

Vue.use(ClientTable, { })
export const getOptions = function (columnDetails) {
    const options = {
        filterByColumn: true,
        headings: {},
        sortable: [],
        filterable: []
    }

    for (const col in columnDetails) {
        options.headings[col] = columnDetails.headings ? columnDetails.headings : col
        if (columnDetails[col].filterable) { options.filterable.push(col) }
        if (columnDetails[col].sortable) { options.sortable.push(col) }
    }
    return options
}

export default {
    name: 'ComponentRender',
    components: {...components, TableCreator},
    props: {
        form: {
            type: Object,
            default: null },
        selectedComponent: {
            type: String,
            default: null }
    },
    methods: {
        renderFunctions: function () {
            if (this.selectedComponent === 'text-input') {
                return {
                    name: 'TextInput',
                    attrs: { id: this.form.id.value },
                    props: { 'pyb-answer': this.form['pyb-answer'].value }

                }
            } else if (this.selectedComponent === 'checkbox-input') {
                return {
                    name: 'CheckboxInput',
                    attrs: { id: this.form.id.value },
                    props: { 'initial-value': 'true', 'pyb-answer': this.form['pyb-answer'].value }
                }
            } else if (this.selectedComponent === 'table-creator') {
                return {
                    name: 'TableCreator',
                    props: {
                        form:
                            { columns: this.form.columns,
                                data: this.form.data,
                                options: getOptions(this.form.columns),
                                name: this.form.name.value ? this.form.name.value : 'tableName'
                            },
                    }
                }
            }
        }
    },
    render (h) {
        if (this.form.isValidForm) {
            return h(this.selectedComponent, {
                ...this.renderFunctions()
            })
        } else {
            return h('span', null, 'No preview available')
        }
    }
}

</script>
