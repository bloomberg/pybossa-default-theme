<template>
    <div class="categorical-field">
        <field-config-base
            :name="name"
            :type="type"
            :editable="true"
            @edit="editing=!editing">
        </field-config-base>
        <div class="labels">
            <h4>
                Labels: <span class="pill label label-primary" v-for="(label, index) in labels || []"
                :key=index>{{label}}</span>
            </h4>
        </div>
        <div v-if="editing" class="form-inline">
            <p>Add single label or multiple comma separated labels. The labels must exactly match the possible values of the response field.</p>
            <div class="form-group">
                <input type="text"
                       class="form-control input-sm"
                       v-model="label">
                <div class="btn btn-sm btn-primary"
                     @click="addLabels(false)">Add Single</div>
                <div class="btn btn-sm btn-primary"
                     @click="addLabels(true)">Add Many</div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import FieldConfigBase from './field_config_base.vue'

export default {
    data () {
        return {
            editing: this.edit,
            label: undefined
        };
    },

    props: ['name', 'type', 'labels', 'edit'],

    methods: {
        ...mapMutations(['addFieldConfig']),

        addLabels(split) {
            let newLabels;
            if (split) {
                newLabels = this.label
                    .split(',')
                    .map((token) => token.trim());
            } else {
                newLabels = [this.label];
            }

            const dedupe = {};
            newLabels.forEach((el) => {
                dedupe[el] = true
            });
            newLabels = Object.keys(dedupe)
                .filter((el) => !this.labels.includes(el));

            this.addFieldConfig({
                name: this.name,
                config: {
                    labels: this.labels.concat(newLabels).sort()
                }
            });
            this.label = undefined;
        }
    },

    components: {
        FieldConfigBase
    }
}
</script>
<style>
.pill {
    margin-right: 0.3em;
    display: inline-block
}
</style>
