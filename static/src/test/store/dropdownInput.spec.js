import { mutations, getters as _getters, state } from '../../components/builder/store/modules/dropdownInput';
import * as types from '../../components/builder/store/types';
import { bindGetters } from '../utils/getters';

describe('Dropdown setup', () => {
  const localState = { ...state };
  const getters = bindGetters(_getters, localState);

  it('Update Label', () => {
    mutations[types.MUTATE_DROPDOWN_LABEL](localState, 'testLabel');
    expect(localState.label).toBe('testLabel');
  });

  it('Update labelAdded', () => {
    mutations[types.MUTATE_DROPDOWN_LABEL_ADDED](localState, true);
    expect(localState.labelAdded).toBe(true);
  });

  describe('Add and Delete, update choices', () => {
    it('Update choice', () => {
      expect(localState.choiceList.length).toBe(1);
      const obj = { ...localState.choiceList[0] };
      obj.label = 'labelUpdated';
      mutations[types.MUTATE_DROPDOWN_UPDATE_CHOICE](state, { choice: obj, index: 0 });
      expect(localState.choiceList[0]).toBe(obj);
    });

    it('Get if form is valid', () => {
      const { isValid } = getters[types.GET_DROPDOWN_INPUT_FORM_VALID];
      expect(isValid).toBe(false);
    });

    it('Add and Delete choice', () => {
      mutations[types.MUTATE_DROPDOWN_ADD_CHOICE](localState);
      expect(localState.choiceList.length).toBe(2);

      mutations[types.MUTATE_DROPDOWN_DELETE_CHOICE](localState, 0);
      expect(localState.choiceList.length).toBe(1);
    });

    it('Clear form', () => {
      mutations[types.MUTATE_DROPDOWN_ADD_CHOICE](localState);
      mutations[types.MUTATE_DROPDOWN_ADD_CHOICE](localState);
      mutations[types.MUTATE_DROPDOWN_ADD_CHOICE](localState);
      expect(localState.choiceList.length).toBe(4);

      mutations[types.MUTATE_CLEAR_DROPDOWN_INPUT_FORM](localState);
      expect(localState.label).toBeFalsy();
      expect(localState.choiceList.length).toBe(1);
      expect(getters[types.GET_DROPDOWN_INPUT_FORM_VALID].isValid).toBe(false);
    });

    it('Pass validation', () => {
        const choice1 = { ...localState.choiceList[0] };
        choice1.value = 'a';
        mutations[types.MUTATE_DROPDOWN_UPDATE_CHOICE](localState, { choice: choice1, index: 0 });
        const choice2 = { ...localState.choiceList[1] };
        choice2.value = 'b';
        mutations[types.MUTATE_DROPDOWN_UPDATE_CHOICE](localState, { choice: choice2, index: 1 });
        expect(getters[types.GET_DROPDOWN_INPUT_FORM_VALID].isValid).toBe(true);
    });
  });
});
