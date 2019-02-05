/* eslint-disable no-undef */
import utils from '../components/builder/utils'
import { state } from '../components/builder/store/modules/textInput'
import { state as checkboxState } from '../components/builder/store/modules/checkboxInput'
const { textInput } = state
const { checkboxInput } = checkboxState
test('getCommonComponentsCode for TEXT_INPUT', () => {
    textInput.form['pyb-answer'].value = 'answername'
    textInput.form['label'].value = 'labelName'
    const componentCode = utils.getCommonComponentsCode(textInput.form, 'TEXT_INPUT')

    expect(componentCode.includes('<text-input')).toBeTruthy()
    expect(componentCode.includes('</text-input>')).toBeTruthy()
    expect(componentCode.includes('pyb-answer="' +
        textInput.form['pyb-answer'].value + '"')).toBeTruthy()
    expect(componentCode.includes('id="' +
        textInput.form.id.value + '"')).toBeTruthy()
})

test('getCommonComponentsCode for CHECKBOX_INPUT', () => {
    checkboxInput.form['pyb-answer'].value = 'answername'
    checkboxInput.form['label'].value = 'labelName'
    checkboxInput.form['initial-value'].value = true
    const componentCode = utils.getCommonComponentsCode(checkboxInput.form, 'CHECKBOX_INPUT')

    expect(componentCode.includes('<checkbox-input')).toBeTruthy()
    expect(componentCode.includes('</checkbox-input>')).toBeTruthy()
    expect(componentCode.includes('pyb-answer="' +
    checkboxInput.form['pyb-answer'].value + '"')).toBeTruthy()
    expect(componentCode.includes('id="' +
    checkboxInput.form.id.value + '"')).toBeTruthy()
    expect(componentCode.includes('initial-value="' +
    checkboxInput.form['initial-value'].value + '"')).toBeTruthy()
    expect(componentCode.includes(':initial-value="' +
        checkboxInput.form['initial-value'].value + '"')).toBeFalsy()
})


test('getCommonComponentsCode for CHECKBOX_INPUT with variable in initial-value', () => {
    checkboxInput.form['pyb-answer'].value = 'answername'
    checkboxInput.form['label'].value = 'labelName'
    checkboxInput.form['initial-value'].isVariable = true
    checkboxInput.form['initial-value'].value = 'variableName'

    const componentCode = utils.getCommonComponentsCode(checkboxInput.form, 'CHECKBOX_INPUT')
    expect(componentCode.includes('<checkbox-input')).toBeTruthy()
    expect(componentCode.includes('</checkbox-input>')).toBeTruthy()
    expect(componentCode.includes('pyb-answer="' +
        checkboxInput.form['pyb-answer'].value + '"')).toBeTruthy()
    expect(componentCode.includes('id="' +
        checkboxInput.form.id.value + '"')).toBeTruthy()
    expect(componentCode.includes(':initial-value="' +
        checkboxInput.form['initial-value'].value + '"')).toBeTruthy()
})
