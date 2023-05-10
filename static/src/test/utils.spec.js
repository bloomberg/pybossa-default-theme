import utils from '../components/builder/utils';
import { state as textInput } from '../components/builder/store/modules/textInput';
import { state as checkboxInput } from '../components/builder/store/modules/checkboxInput';
import { state as radioInput } from '../components/builder/store/modules/radioInput';
import { state as conditionalDisplay } from '../components/builder/store/modules/conditionalDisplay';
import { state as fileUpload } from '../components/builder/store/modules/fileUpload';
import { state as dropdownInput } from '../components/builder/store/modules/dropdownInput';
import { state as multiselectInput } from '../components/builder/store/modules/multiselectInput';
import { state as inputTextArea } from '../components/builder/store/modules/inputTextArea';

test('getSimpleComponentsCode for TEXT_INPUT', () => {
  textInput['pyb-answer'] = 'answername';
  textInput.label = 'Test label';
  textInput.labelAdded = true;
  textInput.validations = '["required"]';

  const componentCode = utils.getSnippet('TEXT_INPUT', textInput);
  expect(componentCode.includes('Test label')).toBeTruthy();

  expect(componentCode.includes('<text-input')).toBeTruthy();
  expect(componentCode.includes('</text-input>')).toBeTruthy();
  expect(
    componentCode.includes(`pyb-answer='${textInput['pyb-answer']}'`)
  ).toBeTruthy();
  expect(
    componentCode.includes(`:validations='${textInput.validations}'`)
  ).toBeTruthy();
  expect(componentCode.includes(`id='${textInput.id}'`)).toBeTruthy();
});

test('getConditionalDisplayCode', () => {
  conditionalDisplay.condition = "'a'=='a'";

  const componentCode = utils.getSnippet('CONDITIONAL_DISPLAY', conditionalDisplay);

  expect(componentCode.includes('<conditional-display')).toBeTruthy();
  expect(componentCode.includes('</conditional-display>')).toBeTruthy();
  expect(
    componentCode.includes(`:condition="${conditionalDisplay.condition}"`)
  ).toBeTruthy();
  expect(componentCode.includes(`id="${conditionalDisplay.id}"`)).toBeTruthy();
});

test('getSimpleComponentsCode for FILE_UPLOAD', () => {
  fileUpload.pybAnswer = 'answername';
  fileUpload.label = 'Test label';
  fileUpload.labelAdded = true;
  fileUpload.fielName = 'testfileName';

  const componentCode = utils.getSnippet('FILE_UPLOAD', fileUpload);

  expect(componentCode.includes('<file-upload')).toBeTruthy();
  expect(componentCode.includes('</file-upload>')).toBeTruthy();
  expect(
    componentCode.includes(`pyb-answer="${fileUpload.pybanswer}"`)
  ).toBeTruthy();
  expect(
    componentCode.includes(`file-name="${fileUpload.fileName}"`)
  ).toBeTruthy();
  expect(componentCode.includes(`id="${fileUpload.id}"`)).toBeTruthy();
});

it('getCheckboxInputCode for CHECKBOX_INPUT', () => {
  checkboxInput.labelAdded = true;
  checkboxInput.label = 'Test label';
  checkboxInput.checkboxList = [];
  checkboxInput.checkboxList[0] = {
    id: 'id0',
    'pyb-answer': 'checkboxanswer0',
    label: 'test checkbox0 label',
    labelAdded: false,
    'initial-value': { value: true, isVariable: true },
    isVariable: true,
    isValidForm: true
  };
  checkboxInput.checkboxList[1] = {
    id: 'id1',
    'pyb-answer': 'checkboxanswer',
    label: 'test checkbox1 label',
    labelAdded: false,
    'initial-value': { value: false, isVariable: true },
    isVariable: true,
    isValidForm: true
  };
  const componentCode = utils.getSnippet('CHECKBOX_INPUT', checkboxInput);
  expect(componentCode.includes('<checkbox-input')).toBeTruthy();
  expect(componentCode.includes('</checkbox-input>')).toBeTruthy();
  expect(componentCode.includes('Test label')).toBeTruthy();
  expect(componentCode.includes(checkboxInput.checkboxList[0].label)).toBeTruthy();
  expect(componentCode.includes(
    `pyb-answer="${checkboxInput.checkboxList[0]['pyb-answer']}"`)).toBeTruthy();
  expect(componentCode.includes(
    `:initial-value="${checkboxInput.checkboxList[0]['initial-value'].value}"`
  )).toBeTruthy();
  expect(componentCode.includes(`id="${checkboxInput.checkboxList[0].id}"`)
  ).toBeTruthy();
  expect(componentCode.includes(checkboxInput.checkboxList[1].label)).toBeTruthy();
  expect(componentCode.includes(
    `pyb-answer="${checkboxInput.checkboxList[1]['pyb-answer']}"`)).toBeTruthy();
  expect(componentCode.includes(
    `:initial-value="${checkboxInput.checkboxList[1]['initial-value'].value}"`
  )).toBeTruthy();
  expect(componentCode.includes(`id="${checkboxInput.checkboxList[1].id}"`)
  ).toBeTruthy();
});

it('getRadioGroupCode for RADIO_INPUT', () => {
  radioInput.labelAdded = true;
  radioInput.label = 'Test label';
  radioInput.pybAnswer = 'radioanswer';
  radioInput.initialValue = 'A';
  radioInput.name = 'radio group';
  radioInput.validations = '["required"]';
  radioInput.radioList = [
    {
      label: 'test radio0 label',
      value: 'A'
    },
    {
      label: 'test radio1 label',
      value: 'B'
    }
  ];
  const componentCode = utils.getSnippet('RADIO_INPUT', radioInput);
  expect(componentCode.includes('<radio-group-input')).toBeTruthy();
  expect(componentCode.includes('</radio-group-input>')).toBeTruthy();
  expect(componentCode.includes(radioInput.label)).toBeTruthy();
  expect(componentCode.includes(radioInput.radioList[0].label)).toBeTruthy();
  expect(componentCode.includes(
    `pyb-answer='${radioInput.pybAnswer}'`)).toBeTruthy();
  expect(componentCode.includes(`validations='${radioInput.validations}'`)).toBeTruthy();
  expect(componentCode.includes(radioInput.radioList[1].label)).toBeTruthy();
  expect(componentCode.includes(`initial-value='A'`)).toBeTruthy();
  expect(componentCode.includes(`name='${radioInput.name}'`)).toBeTruthy();
});

it('getTableInputCode for TABLE', () => {
  const form = { name: 'answerName',
    data: { value: 'sourceNameData', isVariable: true, isDirty: true, list: [] },
    options: { headings: { 'testColName': 'Col Name', 'testColComponentTextInput': 'Text Input Header Column', 'testColComponentCheckboxInput': 'Checkbox Input Header Column', 'testColComponentInputTextArea': 'Input Text Area Header Column' } },
    columns: [{ 'name': 'testColName', 'header': 'Col Name', 'component': 'plain-text', 'id': 'Column 1', 'isDirty': true },
      { 'name': 'testColComponentTextInput', 'header': 'Text Input Header Column', 'component': 'text-input', 'id': 'Column 2', 'isDirty': true },
      { 'name': 'testColComponentCheckboxInput', 'header': 'Checkbox Input Header Column', 'component': 'checkbox-input', 'id': 'Column 3', 'isDirty': true },
      { 'name': 'testColComponentInputTextArea', 'header': 'Input Text Area Header Column', 'component': 'input-text-area', 'id': 'Column 2', 'isDirty': true }],
    isValidForm: true,
    enableEditing: true };

  const componentCode = utils.getSnippet('TABLE', form);
  expect(componentCode.includes('<table-element')).toBeTruthy();
  expect(componentCode.includes('</table-element>')).toBeTruthy();
  expect(componentCode.includes("name='answerName'")).toBeTruthy();
  expect(componentCode.includes(`:data='${form.data.value}'`)).toBeTruthy();
  expect(componentCode.includes(`:options='{`)).toBeTruthy();
  expect(componentCode.includes(`"headings": {`)).toBeTruthy();
  expect(componentCode.includes(`:columns='["testColName","testColComponentTextInput","testColComponentCheckboxInput","testColComponentInputTextArea"]'`)).toBeTruthy();

  expect(componentCode.includes('"testColName": "Col Name"')).toBeTruthy();
  expect(componentCode.includes('"testColComponentTextInput": "Text Input Header Column"')).toBeTruthy();
  expect(componentCode.includes('"testColComponentCheckboxInput": "Checkbox Input Header Column"')).toBeTruthy();
  expect(componentCode.includes('"testColComponentInputTextArea": "Input Text Area Header Column"')).toBeTruthy();

  expect(componentCode.includes(`<div slot="testColComponentTextInput" slot-scope="props">`)).toBeTruthy();
  expect(componentCode.includes(`<text-input :row="props.row" :initial-value="props.row.testColComponentTextInput" pyb-table-answer="testColComponentTextInput"></text-input>`)).toBeTruthy();
  expect(componentCode.includes(`<div slot="testColComponentCheckboxInput" slot-scope="props">`)).toBeTruthy();
  expect(componentCode.includes(`<checkbox-input :row="props.row" :initial-value="props.row.testColComponentCheckboxInput" pyb-table-answer="testColComponentCheckboxInput"></checkbox-input>`)).toBeTruthy();
  expect(componentCode.includes(`<div slot="testColComponentInputTextArea" slot-scope="props">`)).toBeTruthy();
  expect(componentCode.includes(`<input-text-area :row="props.row" :initial-value="props.row.testColComponentInputTextArea" pyb-table-answer="testColComponentInputTextArea"></input-text-area>`)).toBeTruthy();
});

it('getTableInputCode for TABLE with static data', () => {
  const form = { name: 'answerName',
    data: { value: '', isVariable: false, isDirty: true, list: [{ 'test': 'Test Row' }] },
    options: { headings: { 'test': 'Test' } },
    columns: [{ 'name': 'test', 'header': 'Test', 'component': 'plain-text', 'id': 'Column 1', 'isDirty': true }]
  };

  const componentCode = utils.getSnippet('TABLE', form);
  expect(componentCode.includes('<table-element')).toBeTruthy();
  expect(componentCode.includes('</table-element>')).toBeTruthy();
  expect(componentCode.includes(`:data='[{"test":"Test Row"}]'`)).toBeTruthy();
  expect(componentCode.includes(`:columns='["test"]'`)).toBeTruthy();

  expect(componentCode.includes(`:options='{`)).toBeTruthy();
  expect(componentCode.includes(`"headings": {`)).toBeTruthy();

  expect(componentCode.includes(`"test": "Test"`)).toBeTruthy();
});

it('Helper components', () => {
  let componentCode = utils.getSnippet('TASK_TIMER', {});
  expect(componentCode.trim()).toEqual("<task-timer lock=''></task-timer>");

  componentCode = utils.getSnippet('TASK_PRESENTER', {});
  // eslint-disable-next-line no-multi-str
  expect(componentCode.trim()).toEqual('<task-presenter :allow-save-work="" :auto-save-seconds="" :allow-assign-to-user=""></task-presenter>');

  componentCode = utils.getSnippet('CANCEL_BUTTON', {});
  expect(componentCode.trim()).toEqual('<cancel-button></cancel-button>');

  componentCode = utils.getSnippet('BUTTON_ROW', {});
  expect(componentCode.trim()).toEqual('<button-row></button-row>');

  componentCode = utils.getSnippet('SUBMIT_BUTTON', {});
  expect(componentCode.trim()).toEqual('<submit-button></submit-button>');

  componentCode = utils.getSnippet('SUBMIT_LAST_BUTTON', {});
  expect(componentCode.trim()).toEqual('<submit-last-button></submit-last-button>');
});

it('getDropdownCode for DROPDOWN', () => {
  dropdownInput.labelAdded = true;
  dropdownInput.label = 'Test label';
  dropdownInput.pybAnswer = 'dropdownInputanswer';
  dropdownInput.initialValue = 'A';
  dropdownInput.name = 'dropdownInput';
  dropdownInput.validations = '["required"]';
  dropdownInput.choices = { dropdownInput0: 'A', dropdownInput1: 'B' };
  const componentCode = utils.getSnippet('DROPDOWN_INPUT', dropdownInput);
  expect(componentCode.includes('<dropdown-input')).toBeTruthy();
  expect(componentCode.includes('</dropdown-input>')).toBeTruthy();
  expect(componentCode.includes(dropdownInput.label)).toBeTruthy();
  expect(componentCode.includes(
    `pyb-answer='${dropdownInput.pybAnswer}'`)).toBeTruthy();
  expect(componentCode.includes(`initial-value='A'`)).toBeTruthy();
  expect(componentCode.includes(`validations='${dropdownInput.validations}'`)).toBeTruthy();
});

it('getMultiselectCode for MULTISELECT', () => {
  multiselectInput.labelAdded = true;
  multiselectInput.label = 'Test label';
  multiselectInput.pybAnswer = 'multiselectInputanswer';
  multiselectInput.initialValue = 'A';
  multiselectInput.name = 'multiselectInput';
  multiselectInput.validations = '["required"]';
  multiselectInput.choices = { A: 'dropdownInput0', B: 'dropdownInput1' };
  const componentCode = utils.getSnippet('MULTISELECT_INPUT', multiselectInput);
  expect(componentCode.includes('<multi-select-input')).toBeTruthy();
  expect(componentCode.includes('</multi-select-input>')).toBeTruthy();
  expect(componentCode.includes('<label for="">Test label</label>')).toBeTruthy();
  expect(componentCode.includes(multiselectInput.label)).toBeTruthy();
  expect(componentCode.includes(
    `pyb-answer='${multiselectInput.pybAnswer}'`)).toBeTruthy();
  expect(componentCode.includes(`initial-value='[&quot;A&quot;]'`)).toBeTruthy();
  expect(componentCode.includes(`validations='${multiselectInput.validations}'`)).toBeTruthy();
});

it('getMultiselectCode for MULTISELECT', () => {
  multiselectInput.labelAdded = false;
  multiselectInput.pybAnswer = 'multiselectInputanswer';
  multiselectInput.initialValue = '';
  multiselectInput.name = 'multiselectInput';
  multiselectInput.validations = '["required"]';
  multiselectInput.choices = [ 'dropdownInput0' ];
  const componentCode = utils.getSnippet('MULTISELECT_INPUT', multiselectInput);
  expect(componentCode.includes('<multi-select-input')).toBeTruthy();
  expect(componentCode.includes('</multi-select-input>')).toBeTruthy();
  expect(componentCode.includes(
    `pyb-answer='${multiselectInput.pybAnswer}'`)).toBeTruthy();
  expect(componentCode.includes(`choices='[&quot;dropdownInput0&quot;]`));
  expect(componentCode.includes(`initial-value='[]'`)).toBeTruthy();
  expect(componentCode.includes(`validations='${multiselectInput.validations}'`)).toBeTruthy();
});

test('getSimpleComponentsCode for INPUT_TEXT_AREA', () => {
  inputTextArea['pyb-answer'] = 'answername';
  inputTextArea.label = 'Test label';
  inputTextArea.labelAdded = true;
  inputTextArea.validations = '["required"]';

  const componentCode = utils.getSnippet('INPUT_TEXT_AREA', inputTextArea);
  expect(componentCode.includes('Test label')).toBeTruthy();

  expect(componentCode.includes('<input-text-area')).toBeTruthy();
  expect(componentCode.includes('</input-text-area>')).toBeTruthy();
  expect(
    componentCode.includes(`pyb-answer='${inputTextArea['pyb-answer']}'`)
  ).toBeTruthy();
  expect(
    componentCode.includes(`:validations='${inputTextArea.validations}'`)
  ).toBeTruthy();
  expect(componentCode.includes(`id='${inputTextArea.id}'`)).toBeTruthy();
});
