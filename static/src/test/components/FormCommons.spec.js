/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import { __createMocks as createStoreMocks } from '../../components/builder/store'
import FormCommons from '../../components/builder/components/FormCommons'
import * as types from '../../components/builder/store/types'

jest.mock('../../components/builder/store')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('FormCommons', () => {
    let storeMocks
    let wrapper

    beforeEach(() => {
        const freshLocalVue = createLocalVue()
        storeMocks = { ...createStoreMocks(),
            dispatch: jest.fn()}
        wrapper = mount(FormCommons, {
            freshLocalVue,
            mocks: {
                $route: {
                    params: {
                        componentName: 'TEXT_INPUT',
                        header: 'Text Input'
                    }
                }
            },
            store: storeMocks.store
        })
    })

    test('It should get form from store', () => {
        expect(storeMocks.getters[types.GET_TEXT_INPUT_FORM]).toBeCalled()
        expect(wrapper.vm.form['pyb-answer'].value).toBe('pybanswer')
    })

    test('It should update form data.', () => {
        const input = wrapper.find('input[type="text"]')
        input.element.value = 'anschanged'
        input.trigger('input')
        expect(wrapper.vm.form['pyb-answer'].value).toBe('anschanged')
        expect(storeMocks.getters[types.GET_TEXT_INPUT_FORM]).toHaveBeenCalledTimes(2)
    })

    test('Label should be hide until it is clicked.', () => {
        expect(wrapper.vm.form.labelAdded).toBe(false)
        const checkbox = wrapper.find('input[type="checkbox"]')
        checkbox.trigger('click')
        expect(wrapper.vm.form.labelAdded).toBe(true)
        expect(storeMocks.getters[types.GET_TEXT_INPUT_FORM]).toHaveBeenCalledTimes(3)
    })
})
