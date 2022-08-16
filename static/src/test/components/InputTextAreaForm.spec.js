import { mount, createLocalVue } from '@vue/test-utils';
import { __createMocks as createStoreMocks } from '../../components/builder/store';
import InputTextAreaForm from '../../components/builder/components/InputTextArea/InputTextAreaForm';
import * as types from '../../components/builder/store/types';

jest.mock('../../components/builder/store');

describe('InputTextArea', () => {
  let storeMocks;
  let wrapper;

  beforeEach(() => {
    const freshLocalVue = createLocalVue();
    storeMocks = { ...createStoreMocks(), dispatch: jest.fn() };
    wrapper = mount(InputTextAreaForm, {
      freshLocalVue,
      mocks: {
        $route: {
          params: {
            componentName: 'INPUT_TEXT_AREA',
            header: 'Input Text Area'
          }
        }
      },
      store: storeMocks.store
    });
  });

  it('Update pyb-answer.', () => {
    const input = wrapper.find('#pyb-answer');
    input.element.value = 'anschanged';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_INPUT_TEXT_AREA_PYB_ANSWER]).toBeCalledWith(storeMocks.state, 'anschanged');
  });

  it('Update labeladded.', () => {
    expect(wrapper.html()).toContain('component-label');
    const input = wrapper.find('#component-label');
    input.element.value = 'labelupdated';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_INPUT_TEXT_AREA_LABEL]).toBeCalledWith(storeMocks.state, 'labelupdated');
  });

  it('Update label.', () => {
    const checkbox = wrapper.find('#add-label');
    checkbox.trigger('click');
    expect(storeMocks.mutations[types.MUTATE_INPUT_TEXT_AREA_LABEL_ADDED]).toBeCalledWith(storeMocks.state, false);
  });
});
