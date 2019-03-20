<template>
    <div class="stats-config row">
        <div class="col-xs-12">
            <div class="form-inline">
                <div class="form-group" :class="{'has-error': error}">
                    <input type="text" class="form-control input-sm"
                        v-model="fieldName">
                    <select name="field-type" class="form-control input-sm"
                            v-model="fieldType">
                        <option v-for="(conf, type, index) in labelTypes.config"
                                :key="index"
                                :value="type">{{conf.display}}</option>
                    </select>
                    <button class="btn btn-sm btn-primary"
                        :disabled="!fieldName"
                        @click="_addField">Add Field</button>
                    <span v-if="error" class="help-block">{{error}}</span>
                </div>
            </div>
            <div v-if="!Object.keys(answerFields).length">
                <p>No fields currently configured.</p>
            </div>
            <div class="field-config"
                 v-else v-for="(field, name) in answerFields" :key="name">
                <component
                        :is="labelTypes.config[field.type].component"
                        :key="name"
                        :name="name"
                        :edit="isNewField(name)"
                        v-bind="field.config"
                        :type="labelTypes.config[field.type].display">
                </component>
            </div>
            <button class="btn btn-primary" @click="save">Save</button>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import FieldConfigBase from './field_config_base'
import CategoricalFieldConfig from './categorical_field_config'
import labelTypes from './labelTypes'

export default {
    data () {
        return {
            fieldName: '',
            fieldType: labelTypes.default,
            error: false,
            labelTypes
        };
    },

    methods: {
        ...mapMutations(['addField']),

        _addField() {
            if (!this.fieldName) {
                this.error = 'Field Name is Required.';
                return;
            }
            this.addField({
                name: this.fieldName,
                type: this.fieldType,
                config: labelTypes.config[this.fieldType].defaultConfig(),
                newField: true
            });
            this.reset();
        },

        reset() {
            this.fieldName = '';
            this.fieldType = labelTypes.default;
        },

        async save() {
            const answerFields = this.answerFields;
            try {
                const res = await fetch(window.location.pathname, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'X-CSRFToken': this.csrfToken
                    },
                    body: JSON.stringify(this.answerFields)
                });
                if (res.ok) {
                    const data = await res.json();
                    pybossaNotify(data.flash, true, data.status);
                } else {
                    pybossaNotify('An error occurred.', true, 'error');
                }
            }
            catch(error) {
                console.warn(error);
                pybossaNotify('An error occurred.', true, 'error');
            }
        }
    },

    computed: {
        ...mapGetters(['answerFields', 'csrfToken', 'isNewField'])
    },

    components: {
        CategoricalFieldConfig,
        FieldConfigBase
    }
}
</script>
<style>
.field-config {
    margin-bottom: 0.5em
}
</style>
