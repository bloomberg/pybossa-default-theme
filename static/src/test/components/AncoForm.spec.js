import { createLocalVue, mount } from '@vue/test-utils';
import AncoForm from "../../components/builder/components/Anco/AncoForm";
import { __createMocks as createStoreMocks } from '../../components/builder/store';
import * as types from '../../components/builder/store/types';

jest.mock('../../components/builder/store');

describe('AncoForm', () => {
  let storeMocks;
  let wrapper;

  beforeEach(() => {
    const freshLocalVue = createLocalVue();
    storeMocks = { ...createStoreMocks(), dispatch: jest.fn() };
    wrapper = mount(AncoForm, {
      freshLocalVue,
      mocks: {
        $route: {
          params: {
            componentName: 'ANCO',
            header: 'Annotation Copilot'
          }
        }
      },
      store: storeMocks.store
    });
  });

  it('updates pyb-answer', () => {
    const input = wrapper.find('#pyb-answer');
    input.element.value = 'pybAnsChanged';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_ANCO_PYB_ANSWER]).toBeCalledWith(storeMocks.state, 'pybAnsChanged');
  });

  it('updates doc-url', () => {
    expect(wrapper.html()).toContain('doc-url');
    const input = wrapper.find('#doc-url');
    input.element.value = 'docUrlChanged';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_ANCO_DOC_URL]).toBeCalledWith(storeMocks.state, 'docUrlChanged');
  });

  it('updates annotation-url', () => {
    expect(wrapper.html()).toContain('annotation-url');
    const input = wrapper.find('#annotation-url');
    input.element.value = 'annotationUrlChanged';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_ANCO_ANNOTATION_URL]).toBeCalledWith(storeMocks.state, 'annotationUrlChanged');
  });

  it('updates categories', () => {
    const addBtn = wrapper.find('#add');
    addBtn.trigger('click');
    expect(storeMocks.mutations[types.MUTATE_ANCO_ADD_LIST_ITEM]).toBeCalledWith(storeMocks.state, expect.any(Object));
  });
});
