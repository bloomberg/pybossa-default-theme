<template>
    <div>
        <div class="row">
            <div class="col-xs-12">
                <div class="form-inline" v-if="selectedFields.length && Object.keys(users).length">
                    <select class="form-control input-sm" v-model="user">
                        <option value="" disabled selected>Select User</option>
                        <option value="project">project</option>
                        <option v-for="(user, id) in users" :key="id" :value="id">{{user}}</option>
                    </select>
                    <select class="form-control input-sm" v-model="selectedField">
                        <option value="" disabled selected>Select Field</option>
                        <option v-for="field in selectedFields" :key="field" :value="field">{{field}}</option>
                    </select>
                    <button class="btn btn-primary btn-sm" @click="show(selectedField, user, projectId)">Show</button>
                </div>
            </div>
        </div>
        <div class="row" v-if="visible && stats.length">
            <div class="col-xs-12">
                <component
                    :is="displayComponent"
                    v-bind="fields[activeField].config"
                    :stats="stats">
                </component>
            </div>
        </div>
    </div>
</template>
<script>
import ConfusionMatrix from './confusion_matrix.vue'
import AccuracyTable from './accuracy_table.vue'

export default {
    props: {
        users: {
            default: () => []
        },
        fields: {
            default: () => {}
        },
        projectId: Number
    },

    data () {
        return {
            user: '',
            selectedField: '',
            activeField: '',
            stats: [],
            visible: false,
            displayComponent: null
        };
    },

    computed: {
        selectedFields () {
            return Object.keys(this.fields).sort();
        }
    },

    methods: {
        async show (selectedField, user, projectId) {
            this.toggleShow(false);
            this.activeField = selectedField;

            const pullProject = (user === 'project');
            const url = new URL('/api/performancestats', window.location.href);
            if (user !== 'project') {
                url.searchParams.append('user_id', user);
            }
            url.searchParams.append('field', selectedField);
            url.searchParams.append('project_id', projectId);
            const res = await fetch(url);
            this.stats = await res.json();

            this.toggleShow(true);
        },

        toggleShow (visible) {
            this.visible = visible;
            if (visible) {
                this.displayComponent = {
                    'categorical': 'ConfusionMatrix',
                    'freetext': 'AccuracyTable'
                }[this.fields[this.selectedField].type]
            }
        }
    },

    components: {
        ConfusionMatrix,
        AccuracyTable
    }
}
</script>
