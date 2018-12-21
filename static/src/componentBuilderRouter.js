
import Header from './components/Header.vue';
import Builder from './components/builder.vue'
import Imagecrop from './components/image.vue'
import ComponentBuilderForm from './components/builder/components/ComponentBuilderForm'
import Questions from './components/questions.vue'

export const routes = [
    { path: '', name: 'home', components: {
        default: Questions
        } },
    { path: 'questionbuilder', name: 'questionbuilder', components: {
        default: ComponentBuilderForm,
    },},
    { path: '/redirect-me', redirect: { name: 'home' } },
    { path: '*', redirect: '/' }
];