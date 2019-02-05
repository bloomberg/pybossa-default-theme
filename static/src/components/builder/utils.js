import Mustache from 'mustache'
import textInputTemplate from './components/TextInput/textInputTemplate.html'
import checkboxInputTemplate from './components/CheckboxInput/checkboxInputTemplate.html'
import checkboxGroupTemplate from './components/CheckboxInput/checkboxGroupTemplate.html'
import tableTemplate from './components/Table/tableTemplate.html'
import labelTemplate from './components/templates/labelTemplate.html'
import textInputColumnTemplate from './components/Table/textInputColumnTemplate.html'
import checkboxInputColumnTemplate from './components/Table/checkboxInputColumnTemplate.html'
import timerTemplate from './components/helpers/timerTemplate.html'
import taskPresenterTemplate from './components/helpers/taskPresenterTemplate.html'
import cancelButtonTemplate from './components/helpers/cancelButtonTemplate.html'
import buttonRowTemplate from './components/helpers/buttonRowTemplate.html'
import submitButtonTemplate from './components/helpers/submitButtonTemplate.html'
import submitLastButtonTemplate from './components/helpers/submitLastButtonTemplate.html'
import taskPresenterStartTemplate from './components/taskPresenterStartTemplate.html'
import slotTemplate from './components/Table/slotTemplate.html'

const templates = {
    TEXT_INPUT: textInputTemplate,
    CHECKBOX_INPUT: checkboxInputTemplate,
    TABLE: tableTemplate,
    TEXT_INPUT_COLUMN: textInputColumnTemplate,
    CHECKBOX_INPUT_COLUMN: checkboxInputColumnTemplate,
    TIMER: timerTemplate,
    TASK_PRESENTER: taskPresenterTemplate,
    CANCEL_BUTTON: cancelButtonTemplate,
    BUTTON_ROW: buttonRowTemplate,
    SUBMIT_BUTTON: submitButtonTemplate,
    SUBMIT_LAST_BUTTON: submitLastButtonTemplate,
    TASK_PRESENTER_START_TEMPLATE: taskPresenterStartTemplate
}
export default {
    uniqueID: () => {
        return '_' + Math.random().toString(36).substr(2, 9)
    },
    getOptions: function (columns) {
        const options = {
            headings: {}
        }

        columns.forEach((col) => {
            options.headings[col.name] = col.header ? col.header : col.name
        })
        return options
    },
    getComponentTableProps: function (form) {
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
                : form.data.value ? form.data.value : '',
            columns: JSON.stringify(columns),
            options: JSON.stringify(this.getOptions(form.columns), null, '\t'),
        }

        const slotColumns = form.columns.filter((col) => col.component !== 'plain-text')
        const slots = []
        let isInputTable = false
        slotColumns.forEach(function (col) {
            if (col.component === 'checkbox-input') {
                const columnComponent = Mustache.render(checkboxInputColumnTemplate, col)
                slots.push(Mustache.render(slotTemplate,
                    {name: col.name, component: columnComponent}))
                isInputTable = true
            } else if (col.component === 'text-input') {
                const columnComponent = Mustache.render(textInputColumnTemplate, col)
                slots.push(Mustache.render(slotTemplate,
                    {name: col.name, component: columnComponent}))
                isInputTable = true
            }
        })
        const tableTemplate = !isInputTable ? templates.TABLE.replace("name='{{name}}'\n  ", '') : templates.TABLE
        const output = Mustache.render(tableTemplate, {...formForTemplate, slots})

        return output
    },

    getHelperComponentCode: function (component) {
        return Mustache.render(templates[component], {})
    },

    getCheckboxGroup: function (form, component) {
        const checkboxList = []

        form.checkboxList.forEach(function (checkbox) {
            const formForTemplate = {}

            Object.keys(checkbox).forEach((e) => {
                formForTemplate[e] = checkbox[e].value
            })
            let checkboxOutput = Mustache.render(templates[component], formForTemplate).trim()
            Object.keys(checkbox).forEach((e) => {
                if (checkbox[e].isVariable) {
                    checkboxOutput = checkboxOutput.replace(e + '=', ':' + e + '=')
                }
            })
            checkboxList.push(checkboxOutput)
        })
        const idCheckboxGroup = this.uniqueID()
        let output = Mustache.render(checkboxGroupTemplate, {id: idCheckboxGroup, checkboxList})
        if (form.labelAdded) {
            const label = { for: idCheckboxGroup,
                component: output,
                label: form.label.value }
            output = Mustache.render(labelTemplate, label).trim()
        }


        return output
    },

    getCommonComponentsCode: function (form, component) {
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
