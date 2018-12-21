/* eslint-disable max-len */
/* eslint-disable import/no-webpack-loader-syntax */
import Mustache from 'mustache'
import textInputTemplate from './components/TextInput/TextInputTemplate.html'
import checkboxInputTemplate from './components/CheckboxInput/CheckboxInputTemplate.html'
import labelTemplate from './components/templates/LabelTemplate.html'
const templates = {
    TEXT_INPUT: textInputTemplate,
    CHECKBOX_INPUT: checkboxInputTemplate,
}
export default {
    uniqueID: () => {
        return '_' + Math.random().toString(36).substr(2, 9)
    },
    getComponentCode: (form, component) => {
        const formForTemplate = {}

        Object.keys(form).forEach((e) => {
            formForTemplate[e] = form[e].value
        })

        let output = Mustache.render(templates[component], formForTemplate)
        if (form.labelAdded) {
            const label = { for: formForTemplate['id'], component: output, label: formForTemplate['label'] }
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
