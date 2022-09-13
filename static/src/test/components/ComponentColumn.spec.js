import { shallowMount } from '@vue/test-utils';
import ComponentColumns from '../../../src/components/builder/components/Table/ComponentColumns';

describe('ComponentColumn', () => {
  it('Preview Checkbox', () => {
    const wrapper = shallowMount(ComponentColumns, {
      propsData: {
        selectedComponent: 'checkbox-input',
        form: { 'row': { '__col-id': 0 }, 'initial-value': 'true', 'pyb-table-answer': { '__col-id': 0 } }
      } });

    expect(wrapper.find('checkbox-input')).toEqual({ 'selector': 'checkbox-input' });
    expect(wrapper.vm.renderFunctions().props).toEqual({
      'initial-value': false,
      'pyb-table-answer': {
        '__col-id': 0
      },
      'row': {
        '__col-id': 0
      } });
  });

  it('Preview TextInput', () => {
    const wrapper = shallowMount(ComponentColumns, {
      propsData: {
        selectedComponent: 'text-input',
        form: { 'row': { '__col-id': 0 }, 'pyb-table-answer': { '__col-id': 0 } }
      } });

    expect(wrapper.find('text-input')).toEqual({ 'selector': 'text-input' });
    expect(wrapper.vm.renderFunctions().props).toEqual({
      'pyb-table-answer': { '__col-id': 0 },
      'row': { '__col-id': 0 } });
  });

  it('Preview InputTextArea', () => {
    const wrapper = shallowMount(ComponentColumns, {
      propsData: {
        selectedComponent: 'input-text-area',
        form: { 'row': { '__col-id': 0 }, 'pyb-table-answer': { '__col-id': 0 } }
      } });

    expect(wrapper.find('text-input')).toEqual({ 'selector': 'text-input' });
    expect(wrapper.vm.renderFunctions().props).toEqual({
      'pyb-table-answer': { '__col-id': 0 },
      'row': { '__col-id': 0 } });
  });

  it('Preview Nothing', () => {
    const wrapper = shallowMount(ComponentColumns, {
      propsData: {
        selectedComponent: '',
        form: { }
      } });

    expect(wrapper.vm.renderFunctions()).toEqual(undefined);
  });
});
