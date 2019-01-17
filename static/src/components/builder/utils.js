import Mustache from 'mustache'
import textInputTemplate from './components/TextInput/TextInputTemplate.html'
import checkboxInputTemplate from './components/CheckboxInput/CheckboxInputTemplate.html'
import tableTemplate from './components/Table/TableTemplate.html'
import labelTemplate from './components/templates/LabelTemplate.html'
import textInputColumnTemplate from './components/Table/TextInputColumnTemplate.html'
import checkboxInputColumnTemplate from './components/Table/CheckboxInputColumnTemplate.html'
import slotTemplate from './components/Table/SlotTemplate.html'

const templates = {
    TEXT_INPUT: textInputTemplate,
    CHECKBOX_INPUT: checkboxInputTemplate,
    TABLE: tableTemplate,
    TEXT_INPUT_COLUMN: textInputColumnTemplate,
    CHECKBOX_INPUT_COLUMN: checkboxInputColumnTemplate
}
export default {
    uniqueID: () => {
        return '_' + Math.random().toString(36).substr(2, 9)
    },
    getOptions: function (columns) {
        const options = {
            filterByColumn: true,
            headings: {},
            sortable: [],
            filterable: []
        }

        columns.forEach((col) => {
            options.headings[col.name] = col.header ? col.header : col.name
            if (col.filterable) { options.filterable.push(col.name) }
            if (col.sortable) { options.sortable.push(col.name) }
        })
        return options
    },
    getComponentTableProps: function (form) {
        let columnId = ''
        let columnIdInvisible = true
        form.columns.forEach(function (col) {
            if (col.isColumnId) {
                columnId = col.name
                columnIdInvisible = col.hideColumnId
            }
        })
        const columns = form.columns.map((col) => col.name)
        const data = form.data.list.map(function (item) {
            delete item.staticDataId
            delete item['hide-delete']
            return item
        })
        const formForTemplate = {
            name: form.name.value,
            data:
            !form.data.isVariable ? JSON.stringify(data)
                : form.data.value ? form.data.value : 'tableData',
            columns: JSON.stringify(columns),
            options: JSON.stringify(this.getOptions(form.columns), null, '\t'),
            'column-id': columnId,
            'id-visible': !columnIdInvisible
        }

        const slotColumns = form.columns.filter((col) => col.component !== 'plain-text')
        const slots = []
        slotColumns.forEach(function (col) {
            if (col.component === 'checkbox-input') {
                const columnComponent = Mustache.render(checkboxInputColumnTemplate, col)
                slots.push(Mustache.render(slotTemplate,
                    {name: col.name, component: columnComponent}))
            } else if (col.component === 'text-input') {
                const columnComponent = Mustache.render(textInputColumnTemplate, col)
                slots.push(Mustache.render(slotTemplate,
                    {name: col.name, component: columnComponent}))
            }
        })

        const output = Mustache.render(templates.TABLE, {...formForTemplate, slots})

        return output
    },

    getComponentCode: function (form, component) {
        if (component === 'TABLE') { return this.getComponentTableProps(form) } else {
            return this.getCommonCoponentsCode(form, component)
        }
    },

    getCommonCoponentsCode: function (form, component) {
        const formForTemplate = {}

        Object.keys(form).forEach((e) => {
            formForTemplate[e] = form[e].value
        })

        let output = Mustache.render(templates[component], formForTemplate)
        if (form.labelAdded) {
            const label = { for: formForTemplate['id'],
                component: output,
                label: formForTemplate['label'] }
            output = Mustache.render(labelTemplate, label)
        }

        Object.keys(form).forEach((e) => {
            if (form[e].isVariable) {
                output = output.replace(e + '=', ':' + e + '=')
            }
        })

        return output
    }
}
