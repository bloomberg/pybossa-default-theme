<script>
/* eslint-disable vue/require-default-prop */
import Vue from 'vue'
import components from 'test-component.vue'
import { ClientTable } from 'vue-tables-2'

Vue.use(ClientTable, { })

export default {
    name: 'ComponentColumns',
    components: {...components},
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
                    attrs: { id: this.form.id },
                    props: { row: this.form['row'],
                        'pyb-table-answer': this.form['pyb-table-answer'] }
                }
            } else if (this.selectedComponent === 'checkbox-input') {
                return {
                    attrs: { id: this.form.id },
                    props: { row: this.form['row'],
                        'initial-value': 'true',
                        'pyb-table-answer': this.form['pyb-table-answer'] }
                }
            }
        }
    },
    render (h) {
        return h(this.selectedComponent, {
            name: 'test',
            ...this.renderFunctions()
        })
    }
}
</script>
