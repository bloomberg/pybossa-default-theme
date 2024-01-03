import Mustache from 'mustache';
import ancoTemplate from './components/Anco/AncoTemplate.html';
import assistantLLMTemplate from './components/AssistantLLM/AssistantLLMTemplate.html';
import checkboxGroupTemplate from './components/CheckboxInput/checkboxGroupTemplate.html';
import checkboxInputTemplate from './components/CheckboxInput/checkboxInputTemplate.html';
import conditionalDisplayTemplate from './components/ConditionalDisplay/conditionalDisplayTemplate.html';
import dropdownTemplate from './components/DropdownInput/dropdownTemplate.html';
import fileUploadTemplate from './components/FileUpload/fileUploadTemplate.html';
import inputTextAreaTemplate from './components/InputTextArea/inputTextAreaTemplate.html';
import multiselectTemplate from './components/MultiselectInput/multiselectTemplate.html';
import radioGroupTemplate from './components/RadioInput/radioGroupTemplate.html';
import checkboxInputColumnTemplate from './components/Table/checkboxInputColumnTemplate.html';
import inputTextAreaColumnTemplate from './components/Table/inputTextAreaColumnTemplate.html';
import slotTemplate from './components/Table/slotTemplate.html';
import tableTemplate from './components/Table/tableTemplate.html';
import textInputColumnTemplate from './components/Table/textInputColumnTemplate.html';
import taskPresenterTemplate from './components/TaskPresenter/taskPresenterTemplate.html';
import taskTimerTemplate from './components/TaskTimer/taskTimerTemplate.html';
import textInputTemplate from './components/TextInput/textInputTemplate.html';
import textTaggingTemplate from './components/TextTagging/textTaggingTemplate.html';
import buttonRowTemplate from './components/helpers/buttonRowTemplate.html';
import cancelButtonTemplate from './components/helpers/cancelButtonTemplate.html';
import submitButtonTemplate from './components/helpers/submitButtonTemplate.html';
import submitLastButtonTemplate from './components/helpers/submitLastButtonTemplate.html';
import labelTemplate from './components/templates/labelTemplate.html';

import { flatten, flow, uniq } from 'lodash';

export const templates = {
  TEXT_INPUT: textInputTemplate,
  CHECKBOX_INPUT: checkboxInputTemplate,
  TABLE: tableTemplate,
  TEXT_INPUT_COLUMN: textInputColumnTemplate,
  CHECKBOX_INPUT_COLUMN: checkboxInputColumnTemplate,
  CONDITIONAL_DISPLAY: conditionalDisplayTemplate,
  FILE_UPLOAD: fileUploadTemplate,
  TASK_TIMER: taskTimerTemplate,
  TASK_PRESENTER: taskPresenterTemplate,
  CANCEL_BUTTON: cancelButtonTemplate,
  BUTTON_ROW: buttonRowTemplate,
  SUBMIT_BUTTON: submitButtonTemplate,
  SUBMIT_LAST_BUTTON: submitLastButtonTemplate,
  MULTISELECT_INPUT: multiselectTemplate,
  INPUT_TEXT_AREA: inputTextAreaTemplate,
  INPUT_TEXT_AREA_COLUMN: inputTextAreaColumnTemplate,
  ASSISTANT_LLM: assistantLLMTemplate
};
export default {
  uniqueID () {
    return (
      '_' +
      Math.random()
        .toString(36)
        .substring(2, 9)
    );
  },

  getSnippet (component, form) {
    if (component === 'TABLE') {
      return this.getTableCode(form);
    } else if (component === 'CHECKBOX_INPUT') {
      return this.getCheckboxInputCode(form, component);
    } else if (component === 'RADIO_INPUT') {
      return this.getRadioGroupCode(form);
    } else if (component === 'TEXT_INPUT') {
      return this.getSimpleComponentsCode(form, component);
    } else if (component === 'FILE_UPLOAD') {
      return this.getSimpleComponentsCode(form, component);
    } else if (component === 'TEXT_TAGGING') {
      return this.getTextTaggingCode(form);
    } else if (component === 'DROPDOWN_INPUT') {
      return this.getDropdownCode(form);
    } else if (component === 'MULTISELECT_INPUT') {
      return this.getMultiselectCode(form);
    } else if (component === 'CONDITIONAL_DISPLAY') {
      return this.getConditionalDisplayCode(form, component);
    } else if (component === 'TASK_TIMER') {
      return this.getSimpleComponentsCode(form, component);
    } else if (component === 'INPUT_TEXT_AREA') {
      return this.getSimpleComponentsCode(form, component);
    } else if (component === 'ASSISTANT_LLM') {
      return this.getAssistantLLMCode(form);
    } else if (component === 'ANCO') {
      return this.getAncoCode(form);
    } else if (component === 'TASK_PRESENTER') {
       return this.getSimpleComponentsCode(form, component);
    } else {
      return this.getHelperComponentCode(component);
    }
  },
  addBindSymbolIfNeedIt (obj, output) {
    Object.keys(obj).forEach(e => {
      if (obj[e].isVariable) {
        output = output.replace(`${e}=`, `:${e}=`);
      }
    });

    return output;
  },

  getValuesForTemplate (obj) {
    const values = {};
    Object.keys(obj).forEach(e => {
      if (obj[e].isVariable !== undefined) {
        values[e] = obj[e].value;
      } else {
        values[e] = obj[e];
      }
    });
    return values;
  },

  removePropsFromTableTemplate (form) {
    let template = form.columnId ? tableTemplate : tableTemplate.replace("column-id='{{columnId}}'\n  ", '');
    if (!form.enableEditing) {
        template = template.replace("name='{{name}}'\n  ", '');
        template = template.replace(":row-object='{{{rowObject}}}'\n  ", '');
        template = template.replace(":enable-add-rows='{{{enableAddRows}}}'\n  ", '');
        template = template.replace(":add-button-after-table='{{{addButtonAfterTable}}}'\n  ", '');
        template = template.replace(":add-button-before-table='{{{addButtonBeforeTable}}}'\n  ", '');
    }
    return template;
  },

  getTableCode (form) {
    const columns = form.columns.map(col => col.name);

    const formForTemplate = {
      name: form.name,
      data: !form.data.isVariable
        ? JSON.stringify(form.data.list)
        : form.data.value
          ? form.data.value
          : '',
      columns: JSON.stringify(columns),
      options: JSON.stringify(form.options, null, '\t'),
      columnId: form.columnId,
      rowObject: JSON.stringify(form.rowObject, null, '\t'),
      enableAddRows: form.enableAddRows,
      addButtonAfterTable: form.addButtonAfterTable,
      addButtonBeforeTable: form.addButtonBeforeTable
    };

    const slotColumns = form.columns.filter(
      col => col.component !== 'plain-text'
    );
    const slots = [];

    slotColumns.forEach(function (col) {
      if (col.component === 'checkbox-input') {
        const columnComponent = Mustache.render(
          checkboxInputColumnTemplate,
          col
        );
        slots.push(
          Mustache.render(slotTemplate, {
            name: col.name,
            component: columnComponent
          })
        );
      } else if (col.component === 'text-input') {
        const columnComponent = Mustache.render(textInputColumnTemplate, col);
        slots.push(
          Mustache.render(slotTemplate, {
            name: col.name,
            component: columnComponent
          })
        );
      } else if (col.component === 'input-text-area') {
        const columnComponent = Mustache.render(inputTextAreaColumnTemplate, col);
        slots.push(
          Mustache.render(slotTemplate, {
            name: col.name,
            component: columnComponent
          })
        );
      } else {
        const columnComponent =
        `<!--
            Please enter you custom component in this area.
            Ensure to add these props :row="props.row" :initial-value="props.row.${col.name}" pyb-table-answer="${col.name}"
         -->\n`;

        slots.push(
          Mustache.render(slotTemplate, {
            name: col.name,
            component: columnComponent
          })
        );
      }
    });
    const template = this.removePropsFromTableTemplate(form);
    const output = Mustache.render(template, {
      ...formForTemplate,
      slots
    });

    return output;
  },

  getHelperComponentCode (component) {
    return Mustache.render(templates[component], {});
  },

  getCheckboxInputCode (form, component) {
    const checkboxList = [];

    form.checkboxList.forEach(checkbox => {
      const formForTemplate = this.getValuesForTemplate(checkbox);
      let checkboxOutput = Mustache.render(
        templates[component],
        formForTemplate
      ).trim();
      checkboxOutput = this.addBindSymbolIfNeedIt(checkbox, checkboxOutput);
      checkboxList.push(checkboxOutput.trim());
    });

    const idCheckboxGroup = this.uniqueID();
    let output = Mustache.render(checkboxGroupTemplate, {
      id: idCheckboxGroup,
      checkboxList
    });
    if (form.labelAdded) {
      const label = {
        for: idCheckboxGroup,
        component: output,
        label: form.label
      };
      output = Mustache.render(labelTemplate, label);
    }

    return output;
  },

  getRadioGroupCode ({ radioList, labelAdded, label, pybAnswer, initialValue, name, validations }) {
    let choices = {};
    radioList.forEach(radio => {
      choices[radio.value] = radio.label;
    });
    let output = Mustache.render(
      radioGroupTemplate,
      {
        pybAnswer,
        choices: JSON.stringify(choices),
        initialValue,
        name,
        validations
      }
    );
    if (labelAdded) {
      const labelArgs = {
        component: output,
        label
      };
      output = Mustache.render(labelTemplate, labelArgs);
    }

    return output;
  },

  getTextTaggingCode (textTagging) {
    const {
      pybAnswer,
      labelAdded,
      label,
      tags,
      text: { snippet, preview },
      readOnly,
      entities,
      confidenceThreshold
    } = textTagging;

    let output = Mustache.render(
      textTaggingTemplate,
      {
        pybAnswer,
        tags: JSON.stringify(tags),
        text: snippet,
        readOnly,
        entities: getEntitiesString(),
        confidenceThreshold,
        // If text snippet and preview are the same then it is static text so no Vue binding.
        // Otherwise it is a variable name so do Vue binding.
        bindText: (snippet === preview) ? '' : ':'
      }
    );

    if (labelAdded) {
      const labelArgs = {
        component: output,
        label
      };
      output = Mustache.render(labelTemplate, labelArgs);
    }
    return output;

    function getEntitiesString () {
      const snippet = entities.snippet;
      // If the snippet is a string then it is a variable name so leave it alone.
      if (typeof snippet === 'string') return snippet;
      // Otherwise it's an array so stringify it.
      else return JSON.stringify(snippet);
    }
  },

  getAssistantLLMCode (assistantLLM) {
    const {
      id,
      labelAdded,
      label,
      prompt: { snippet, preview },
      content,
      promptSourceType,
      model,
      modelParams,
      editable,
      pybAnswer
    } = assistantLLM;

    let output = Mustache.render(
      assistantLLMTemplate,
      {
        id: id,
        pybAnswer: pybAnswer,
        prompt: snippet,
        content: content,
        bindPrompt: getBindChar(promptSourceType),
        model: model,
        modelParams: modelParams,
        editable: editable
      }
    );

    if (labelAdded) {
      const labelArgs = {
        component: output,
        label
      };
      output = Mustache.render(labelTemplate, labelArgs);
    }
    return output;

    function getBindChar (source) {
      return source === 'variable' ? ':' : '';
    }
  },

  getDropdownCode ({ pybAnswer, choices, labelAdded, label, initialValue, validations }) {
    let output = Mustache.render(
      dropdownTemplate,
      {
        pybAnswer,
        choices: JSON.stringify(choices),
        initialValue,
        validations
      }
    );

    if (labelAdded) {
      const labelArgs = {
        component: output,
        label
      };
      output = Mustache.render(labelTemplate, labelArgs);
    }
    return output;
  },

  getMultiselectCode ({ pybAnswer, choices, labelAdded, label, initialValue, validations }) {
    const initVal = initialValue ? [initialValue] : [];

    let output = Mustache.render(
      multiselectTemplate,
      {
        pybAnswer,
        choices: JSON.stringify(choices),
        initialValue: JSON.stringify(initVal),
        validations
      }
    );

    if (labelAdded) {
      const labelArgs = {
        component: output,
        label
      };
      output = Mustache.render(labelTemplate, labelArgs);
    }
    return output;
  },

  getSimpleComponentsCode (form, component) {
    const formForTemplate = this.getValuesForTemplate(form);

    let output = Mustache.render(templates[component], formForTemplate);
    if (form.labelAdded) {
      const label = {
        for: formForTemplate['id'],
        component: output,
        label: formForTemplate['label']
      };
      output = Mustache.render(labelTemplate, label);
    }
    output = this.addBindSymbolIfNeedIt(form, output);

    return output;
  },

  getConditionalDisplayCode (form, component) {
    const formForTemplate = this.getValuesForTemplate(form);
    const output = Mustache.render(templates[component], formForTemplate);
    return output;
  },

  getAncoCode ({ pybAnswer, categoryList = [], docUrl, annotationUrl }) {
    const categories = categoryList.filter(c => c.name).map(c => ({
      name: c.name,
      style: c.style,
      valueType: c.type
    }));

    const config = {
      docUrl,
      annotationType: 'BoundingBox',
      requiredAnnotationOnLoad: !!annotationUrl,
      categories: JSON.stringify(categories)
    };

    if (annotationUrl) {
      config.annotationUrl = annotationUrl;
    }

    const output = Mustache.render(ancoTemplate, {
      pybAnswer,
      ...config
    });

    return output;
  },

  toMultiDict (keyValueIterator) {
    const dict = {};
    for (const [key, value] of keyValueIterator) {
      let values = dict[key];
      if (!values) {
        values = dict[key] = [];
      }
      values.push(value);
    }
    return dict;
  },

  toFormValidation (errorsMultiDict) {
    const messages = flow(Object.values, flatten, uniq)(errorsMultiDict);
    const isValid = !messages.length;
    return { isValid, messages };
  }
};
