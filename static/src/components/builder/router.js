import Questions from './components/Questions.vue';
import Header from './components/Header.vue';
import Content from './components/Content.vue';
import CheckboxForm from './components/CheckboxInput/CheckboxInputForm.vue';
import TextInputForm from './components/TextInput/TextInputForm.vue';
import TableForm from './components/Table/TableForm.vue';
import PreviewCommons from './components/PreviewCommons.vue';
import RadioForm from './components/RadioInput/RadioInputForm.vue';
import TextTaggingForm from './components/TextTagging/TextTaggingForm.vue';
import DropdownForm from './components/DropdownInput/DropdownForm.vue';
import MultiselectForm from './components/MultiselectInput/MultiselectForm.vue';
import ConditionalDisplayForm from './components/ConditionalDisplay/ConditionalDisplayForm.vue';
import FileUploadForm from './components/FileUpload/FileUploadForm.vue';
import TaskTimerForm from './components/TaskTimer/TaskTimerForm.vue';
import InputTextAreaForm from './components/InputTextArea/InputTextAreaForm.vue';
import AssistantLLMForm from './components/AssistantLLM/AssistantLLMForm.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    components: {
      default: Questions,
      header: Header
    }
  },
  {
    path: '/textinput',
    name: 'TEXT_INPUT',
    components: {
      default: Content,
      header: Header
    },
    children: [
      {
        path: 'form',
        name: 'TEXT_INPUT_FORM',
        components: { default: TextInputForm }
      },
      {
        path: 'preview',
        name: 'TEXT_INPUT_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'TEXT_INPUT_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/taskTimer',
    name: 'TASK_TIMER',
    components: {
      default: Content,
      header: Header
    },
    children: [
      {
        path: 'form',
        name: 'TASK_TIMER_FORM',
        components: { default: TaskTimerForm }
      },
      {
        path: 'preview',
        name: 'TASK_TIMER_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'TASK_TIMER_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/radiogroupinput',
    name: 'RADIO_INPUT',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'RADIO_INPUT_FORM',
        components: { default: RadioForm }
      },
      {
        path: 'preview',
        name: 'RADIO_INPUT_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'RADIO_INPUT_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/dropdowninput',
    name: 'DROPDOWN_INPUT',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'DROPDOWN_INPUT_FORM',
        components: { default: DropdownForm }
      },
      {
        path: 'preview',
        name: 'DROPDOWN_INPUT_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'DROPDOWN_INPUT_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/multiselectinput',
    name: 'MULTISELECT_INPUT',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'MULTISELECT_INPUT_FORM',
        components: { default: MultiselectForm }
      },
      {
        path: 'preview',
        name: 'MULTISELECT_INPUT_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'MULTISELECT_INPUT_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/checkboxinput',
    name: 'CHECKBOX_INPUT',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'CHECKBOX_INPUT_FORM',
        components: { default: CheckboxForm }
      },
      {
        path: 'preview',
        name: 'CHECKBOX_INPUT_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'CHECKBOX_INPUT_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/table',
    name: 'TABLE',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'TABLE_FORM',
        components: { default: TableForm }
      },
      {
        path: 'preview',
        name: 'TABLE_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'TABLE_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/textTagging',
    name: 'TEXT_TAGGING',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'TEXT_TAGGING_FORM',
        components: { default: TextTaggingForm }
      },
      {
        path: 'preview',
        name: 'TEXT_TAGGING_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'TEXT_TAGGING_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/conditionaldisplay',
    name: 'CONDITIONAL_DISPLAY',
    components: {
      default: Content,
      header: Header
    },
    children: [
      {
        path: 'form',
        name: 'CONDITIONAL_DISPLAY_FORM',
        components: { default: ConditionalDisplayForm }
      },
      {
        path: 'preview',
        name: 'CONDITIONAL_DISPLAY_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'CONDITIONAL_DISPLAY_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/fileupload',
    name: 'FILE_UPLOAD',
    components: {
      default: Content,
      header: Header
    },
    children: [
      {
        path: 'form',
        name: 'FILE_UPLOAD_FORM',
        components: { default: FileUploadForm }
      },
      {
        path: 'preview',
        name: 'FILE_UPLOAD_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'FILE_UPLOAD_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/assistantLLM',
    name: 'ASSISTANT_LLM',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'ASSISTANT_LLM_FORM',
        components: { default: AssistantLLMForm }
      },
      {
        path: 'preview',
        name: 'ASSISTANT_LLM_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'ASSISTANT_LLM_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/helper',
    name: 'HELPER',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'buttonRow/preview',
        name: 'BUTTON_ROW_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'taskPresenter/preview',
        name: 'TASK_PRESENTER_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'cancelButton/preview',
        name: 'CANCEL_BUTTON_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'submitButton/preview',
        name: 'SUBMIT_BUTTON_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'submitLastButton/preview',
        name: 'SUBMIT_LAST_BUTTON_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'buttonRow/code',
        name: 'BUTTON_ROW_CODE',
        components: { default: PreviewCommons }
      },
      {
        path: 'taskPresenter/code',
        name: 'TASK_PRESENTER_CODE',
        components: { default: PreviewCommons }
      },
      {
        path: 'cancelButton/code',
        name: 'CANCEL_BUTTON_CODE',
        components: { default: PreviewCommons }
      },
      {
        path: 'submitButton/code',
        name: 'SUBMIT_BUTTON_CODE',
        components: { default: PreviewCommons }
      },
      {
        path: 'submitLastButton/code',
        name: 'SUBMIT_LAST_BUTTON_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/inputtextarea',
    name: 'INPUT_TEXT_AREA',
    components: {
      default: Content,
      header: Header
    },
    children: [
      {
        path: 'form',
        name: 'INPUT_TEXT_AREA_FORM',
        components: { default: InputTextAreaForm }
      },
      {
        path: 'preview',
        name: 'INPUT_TEXT_AREA_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'INPUT_TEXT_AREA_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  { path: '/redirect-me', redirect: { name: 'home' } },
  { path: '*', redirect: '/' }
];
