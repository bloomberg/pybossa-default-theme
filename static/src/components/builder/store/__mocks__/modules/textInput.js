/* eslint-disable no-undef */
import * as types from '../../types'

export const state = {
    textInput: {
        form: {
            'id': { value: '1', isVariable: false },
            'pyb-answer': { value: 'pybanswer', isVariable: false },
            'label': { value: 'label', isVariable: false },
            'labelAdded': false
        }
    }
}

export const getters = {
    [types.GET_TEXT_INPUT_FORM]: jest.fn().mockReturnValue(
        {
            'id': { value: '1', isVariable: false },
            'pyb-answer': { value: 'pybanswer', isVariable: false },
            'label': { value: 'label', isVariable: false },
            'labelAdded': false
        }
    )
}
export const mutations = {
    [types.MUTATE_TEXT_INPUT_FORM]: jest.fn()
}

export const actions = {
    [types.UPDATE_TEXT_INPUT_FORM]: jest.fn(),
    [types.CLEAR_TEXT_INPUT_FORM]: jest.fn(),
}

export default {
    state,
    mutations,
    actions,
    getters
}
