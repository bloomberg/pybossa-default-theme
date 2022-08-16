import { mutations, getters, state } from '../../components/builder/store/modules/inputTextArea';
import * as types from '../../components/builder/store/types';
describe('Input-Text-Area setup', () => {
  let localState = { ...state };

  it('Update Label', () => {
    mutations[types.MUTATE_INPUT_TEXT_AREA_LABEL](localState, 'testLabel');
    expect(localState.label).toBe('testLabel');
  });

  it('Update labelAdded', () => {
    mutations[types.MUTATE_INPUT_TEXT_AREA_LABEL_ADDED](localState, true);
    expect(localState.labelAdded).toBe(true);
  });

  it('Update pybanswer', () => {
    mutations[types.MUTATE_INPUT_TEXT_AREA_PYB_ANSWER](localState, 'pybanswer');
    expect(localState['pyb-answer']).toBe('pybanswer');
  });

  it('Update validations', () => {
    mutations[types.MUTATE_INPUT_TEXT_AREA_VALIDATIONS](localState, [{ name: 'required' }]);
    expect(localState.validations).toEqual([{ name: 'required' }]);
  });

  it('Get Form', () => {
    const props = getters[types.GET_INPUT_TEXT_AREA_PROPS](localState);
    expect(props.label).toEqual('testLabel');
    expect(props.labelAdded).toEqual(true);
    expect(props['pyb-answer']).toEqual('pybanswer');
    expect(props.validations).toBe(JSON.stringify(['required']));
    expect(props.isValidForm).toEqual(true);
  });

  it('Clear form', () => {
    mutations[types.MUTATE_CLEAR_INPUT_TEXT_AREA_FORM](localState);
    expect(localState.label).toBeFalsy();
    expect(localState['pyb-answer']).toBeFalsy();
    expect(localState.labelAdded).toBe(false);
    expect(localState.isValidForm).toBeTruthy();
  });
});
