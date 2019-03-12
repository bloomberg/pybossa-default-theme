'use strict';

const _types = {
    CATEGORICAL: 'categorical',
    FREETEXT: 'freetext'
}

const config = {
    [_types.CATEGORICAL]: {
        display: 'Categorical',
        component: 'CategoricalFieldConfig',
        defaultConfig() {
            return { labels: [] }
        }
    },

    [_types.FREETEXT]: {
        display: 'Free Text',
        component: 'FieldConfigBase',
        defaultConfig() {
            return {}
        }
    }
}

export default {
    default: _types.CATEGORICAL,
    config
}