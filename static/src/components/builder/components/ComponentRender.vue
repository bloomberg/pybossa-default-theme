<script>
/* eslint-disable vue/require-default-prop */
import components from 'test-component.vue'

export default {
    components,
    props: {
        form: {
            type: Object,
            default: null },
        selectedComponent: {
            type: String,
            default: null }
    },
    render (h) {
        const renderFunctions = {
            'text-input': {
                attrs: { id: this.form.id.value },
                props: { 'pyb-answer': this.form['pyb-answer'].value }
            },
            'checkbox-input': {
                attrs: { id: this.form.id.value },
                props: { 'initial-value': 'true', 'pyb-answer': this.form['pyb-answer'].value }
            }
        }
        return h(this.selectedComponent, {
            ...renderFunctions[this.selectedComponent]
        })
    }
}
</script>
