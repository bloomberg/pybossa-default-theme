import Questions from './components/Questions.vue'
import Header from './components/Header.vue'
import Content from './components/Content.vue'
import CheckboxForm from './components/CheckboxInput/CheckboxInputForm.vue'
import TextInputForm from './components/TextInput/TextInputForm.vue'
import TableForm from './components/Table/TableForm.vue'
import PreviewCommons from './components/PreviewCommons.vue'

export const routes = [
    { path: '/',
        name: 'home',
        components: {
            default: Questions,
            header: Header }
    },
    { path: '/textinput',
        name: 'TEXT_INPUT',
        components: {
            default: Content,
            header: Header
        },
        children: [
            {
                path: '/textinput/form',
                name: 'TEXT_INPUT_FORM',
                components: { default: TextInputForm }
            },
            {
                path: '/textinput/preview',
                name: 'TEXT_INPUT_PREVIEW',
                components: { default: PreviewCommons }
            }

        ]
    },
    { path: '/checkboxinput',
        name: 'CHECKBOX_INPUT',
        components: {default: Content,
            header: Header },
        children: [
            {
                path: '/checkboxinput/form',
                name: 'CHECKBOX_INPUT_FORM',
                components: { default: CheckboxForm }
            },
            {
                path: '/checkboxinput/preview',
                name: 'CHECKBOX_INPUT_PREVIEW',
                components: { default: PreviewCommons }
            }

        ]
    },
    { path: '/table',
        name: 'TABLE',
        components: {default: Content,
            header: Header },
        children: [
            {
                path: '/table/form',
                name: 'TABLE_FORM',
                components: { default: TableForm }
            },
            {
                path: '/table/preview',
                name: 'TABLE_PREVIEW',
                components: { default: PreviewCommons }
            }

        ]
    },
    { path: '/helper',
        name: 'HELPER',
        components: {default: Content,
            header: Header },
        children: [
            {
                path: '/helper/timer/preview',
                name: 'TIMER_PREVIEW',
                components: { default: PreviewCommons }
            },
            {
                path: '/helper/buttonRow/preview',
                name: 'BUTTON_ROW_PREVIEW',
                components: { default: PreviewCommons }
            },
            {
                path: '/helper/tasPresenter/preview',
                name: 'TASK_PRESENTER_PREVIEW',
                components: { default: PreviewCommons }
            },
            {
                path: '/helper/cancelButton/preview',
                name: 'CANCEL_BUTTON_PREVIEW',
                components: { default: PreviewCommons }
            },
            {
                path: '/helper/submitButton/preview',
                name: 'SUBMIT_BUTTON_PREVIEW',
                components: { default: PreviewCommons }
            },
            {
                path: '/helper/submitLastButton/preview',
                name: 'SUBMIT_LAST_BUTTON_PREVIEW',
                components: { default: PreviewCommons }
            }
        ]
    },
    { path: '/redirect-me', redirect: { name: 'home' } },
    { path: '*', redirect: '/' }
]
