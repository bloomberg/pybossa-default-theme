/* eslint-disable no-undef */
import { mutations, getters as _getters, getColumnObject, initialState, isAnyDirtyColumn, isAnswerFieldDirty, isAnswerFieldRequired,
  isAnyColumnComponent, isAnyColumnNameEmpty, isAnyColumnNameRepeated,
  isDataNameEmptyAndRequired, isFormUntouched } from '../../components/builder/store/modules/table';
import * as types from '../../components/builder/store/types';
import { bindGetters } from '../utils/getters';

describe('Table store', () => {
  const localState = { };
  const getters = bindGetters(_getters, localState);

  beforeEach(() => {
    Object.assign(localState, initialState());
  });
  it('Initial State', () => {
    expect(localState.id).toBeDefined();
    expect(localState.name).toBeDefined();
    expect(localState.name.value).toBeDefined();
    expect(localState.name.isDirty).toBeDefined();
    expect(localState.data).toBeDefined();
    expect(localState.data.value).toBeDefined();
    expect(localState.data.isVariable).toBeDefined();
    expect(localState.data.isDirty).toBeDefined();
    expect(localState.dataRowKeys).toBeDefined();
    expect(localState.dataRowObj).toBeDefined();
    expect(localState.columnKeys).toBeDefined();
    expect(localState.columnsListObj).toBeDefined();
    expect(localState.dataRowKeys).toBeDefined();
    expect(localState.colCounter).toBeDefined();
    expect(localState.enableEditing).toBeDefined();
  });

  it('getColumnObject ', () => {
    const column = getColumnObject(1);
    expect(column).toEqual({
      name: '',
      header: '',
      component: 'plain-text',
      id: `Column 1`,
      isDirty: false
    });
  });

  it('GET_TABLE_PROPS ', () => {
    localState.columnsListObj[localState.columnKeys[0]].name = 'testColName';
    localState.columnsListObj[localState.columnKeys[0]].header = 'Header testColName';
    localState.dataRowKeys = ['id1'];
    localState.dataRowObj['id1'] = { id: 'id1', [localState.columnKeys[0]]: 'test data for testName' };
    localState.data.isVariable = false;
    localState.data.value = 'dataName';
    localState.name.value = 'ansTableName';

    const props = getters[types.GET_TABLE_PROPS];
    const expectedOptions = { headings: { testColName: 'Header testColName' } };
    expect(props.options).toEqual(expectedOptions);

    const expectedData = { isVariable: false,
      value: 'dataName',
      list: [{ testColName: 'test data for testName' }],
      isDirty: false };
    expect(props.data).toEqual(expectedData);

    const expectedColumns = [{
      component: 'plain-text',
      header: 'Header testColName',
      id: 'Column 1',
      isDirty: false,
      name: 'testColName'
    }];
    expect(props.columns).toEqual(expectedColumns);
  });

  it('GET_TABLE_COLUMNS_LIST', () => {
    localState.columnsListObj[localState.columnKeys[0]].name = 'testColName';
    localState.columnsListObj[localState.columnKeys[0]].header = 'Header testColName';
    const columns = getters[types.GET_TABLE_COLUMNS_LIST];
    const expectedColumns = [{
      component: 'plain-text',
      header: 'Header testColName',
      id: 'Column 1',
      isDirty: false,
      name: 'testColName'
    }];
    expect(columns).toEqual(expectedColumns);
  });

  it('GET_TABLE_DATA_LIST', () => {
    let data = getters[types.GET_TABLE_DATA_LIST];
    let expectedData = [];

    localState.columnsListObj[localState.columnKeys[0]].name = 'testColName';
    localState.columnsListObj[localState.columnKeys[0]].header = 'Header testColName';
    localState.dataRowKeys = ['id1'];
    localState.dataRowObj['id1'] = { id: 'id1', [localState.columnKeys[0]]: 'test data for testName' };
    data = getters[types.GET_TABLE_DATA_LIST];
    expectedData = [{ id: 'id1', 'Column 1': 'test data for testName' }];
    expect(data).toEqual(expectedData);
  });

  it('Validation isAnyDirtyColumn', () => {
    const columns = [{
      component: 'plain-text',
      header: '',
      id: 'Column 1',
      isDirty: true,
      name: ''
    }];
    expect(isAnyDirtyColumn(columns)).toBeTruthy();
  });

  it('Validation isAnyColumnComponent', () => {
    const columns = [{
      component: 'text-input',
      header: '',
      id: 'Column 1',
      isDirty: false,
      name: ''
    }];
    expect(isAnyColumnComponent(columns)).toBeTruthy();
  });

  it('Validation isAnyColumnComponent', () => {
    const columns = [{
      component: 'input-text-area',
      header: '',
      id: 'Column 1',
      isDirty: false,
      name: ''
    }];
    expect(isAnyColumnComponent(columns)).toBeTruthy();
  });

  it('Validation isAnyColumnNameEmpty', () => {
    const columns = [{
      component: 'plain-text',
      header: 'Header testColName',
      id: 'Column 1',
      isDirty: false,
      name: ''
    }];
    expect(isAnyColumnNameEmpty(columns)).toBeTruthy();
  });

  it('Validation isAnyColumnNameRepeated', () => {
    const columns = [{
      component: 'plain-text',
      header: '',
      id: 'Column 1',
      isDirty: true,
      name: 'sameName'
    },
    {
      component: 'plain-text',
      header: '',
      id: 'Column 2',
      isDirty: true,
      name: 'sameName'
    }];
    expect(isAnyColumnNameRepeated(columns)).toBeTruthy();
  });

  it('Validation isDataNameEmptyAndRequired', () => {
    const state = { data: { value: '', isDirty: true, isVariable: true } };
    expect(isDataNameEmptyAndRequired(state)).toBeTruthy();
    state.data.isVariable = false;
    expect(isDataNameEmptyAndRequired(state)).toBeFalsy();
  });

  it('Validation isFormUntouched', () => {
    const state = { name: { value: '', isDirty: true } };
    expect(isFormUntouched(state, false)).toBeFalsy();
    state.name.isDirty = false;
    expect(isFormUntouched(state, true)).toBeFalsy();
    expect(isFormUntouched(state, false)).toBeTruthy();
  });

  it('Validation isAnswerFieldDirty', () => {
    const state = { name: { value: '', isDirty: true } };
    expect(isAnswerFieldDirty(state)).toBeTruthy();
  });

  it('Validation isFormUntouched', () => {
    const state = { enableEditing: true, name: { value: '', isDirty: true } };
    expect(isAnswerFieldRequired(state)).toBeTruthy();
    state.enableEditing = false;
    expect(isAnswerFieldRequired(state)).toBeFalsy();
  });

  it('GET_TABLE_FORM_VALID repeatedColName', () => {
    localState.data.isVariable = false;
    localState.columnKeys.push('Column 2');
    localState.columnsListObj[localState.columnKeys[0]].name = 'testColName';
    localState.columnsListObj[localState.columnKeys[0]].header = 'Header testColName';
    localState.columnsListObj[localState.columnKeys[1]] = { ...localState.columnsListObj[localState.columnKeys[0]] };
    localState.columnsListObj[localState.columnKeys[1]].id = 'Column 2';
    localState.columnsListObj[localState.columnKeys[1]].isDirty = true;

    localState.columnsListObj[localState.columnKeys[1]].name = 'testColName';
    let { isValid } = getters[types.GET_TABLE_FORM_VALID];
    expect(isValid).toBeFalsy();
  });

  it('GET_TABLE_FORM_VALID isFormUntouched ', () => {
    const { isValid } = getters[types.GET_TABLE_FORM_VALID];
    expect(isValid).toBeFalsy();
  });

  it('GET_TABLE_FORM_VALID anyDirtyColumn', () => {
    localState.columnsListObj[localState.columnKeys[0]].isDirty = true;
    const { isValid } = getters[types.GET_TABLE_FORM_VALID];
    expect(isValid).toBeFalsy();
  });

  it('GET_TABLE_FORM_VALID isDataNameEmptyAndRequired', () => {
    localState.data.isVariable = true;
    localState.data.value = '';
    localState.data.isDirty = true;
    const { isValid } = getters[types.GET_TABLE_FORM_VALID];
    expect(isValid).toBeFalsy();
  });

  it('GET_TABLE_FORM_VALID isAnswerFieldDirty', () => {
    localState.columnsListObj[localState.columnKeys[0]].component = 'text-input';
    localState.name.isDirty = true;
    const { isValid } = getters[types.GET_TABLE_FORM_VALID];
    expect(isValid).toBeFalsy();
  });

  it('MUTATE_TABLE_NAME', () => {
    mutations[types.MUTATE_TABLE_NAME](localState, { value: 'name' });
    expect(localState.name.value).toBe('name');
    expect(localState.name.isDirty).toBeTruthy();

    mutations[types.MUTATE_TABLE_NAME](localState, { });
    expect(localState.name.isDirty).toBeTruthy();
  });

  it('MUTATE_TABLE_DATA', () => {
    mutations[types.MUTATE_TABLE_DATA](localState, { value: 'name', isVariable: true });
    expect(localState.data).toEqual({ value: 'name', isVariable: true, isDirty: true });
    mutations[types.MUTATE_TABLE_DATA](localState, { });
    expect(localState.data).toEqual({ value: 'name', isVariable: true, isDirty: true });
  });

  it('MUTATE_TABLE_UPDATE_COLUMN', () => {
    const col = { ...localState.columnsListObj[localState.columnKeys[0]] };
    col.name = 'colName';
    mutations[types.MUTATE_TABLE_UPDATE_COLUMN](localState, col);
    expect(localState.columnsListObj[localState.columnKeys[0]]).toEqual({
      component: 'plain-text',
      header: '',
      id: 'Column 1',
      isDirty: false,
      name: 'colName'
    });
  });

  it('MUTATE_TABLE_ADD_COLUMN MUTATE_TABLE_DELETE_COLUMN', () => {
    mutations[types.MUTATE_TABLE_ADD_COLUMN](localState);
    expect(localState.columnKeys).toEqual(['Column 1', 'Column 2']);
    const props = getters[types.GET_TABLE_PROPS];
    expect(props.columns.length).toBe(2);

    mutations[types.MUTATE_TABLE_DELETE_COLUMN](localState, 'Column 1');
    expect(localState.columnKeys).toEqual(['Column 2']);
  });

  it('MUTATE_TABLE_ADD_DATA_ROW and MUTATE_TABLE_DELETE_DATA_ROW, MUTATE_TABLE_UPDATE_DATA_ROW', () => {
    mutations[types.MUTATE_TABLE_ADD_DATA_ROW](localState);
    expect(localState.dataRowKeys.length).toBe(1);
    expect(localState.dataRowObj[localState.dataRowKeys[0]]['Column 1']).toBeDefined();

    mutations[types.MUTATE_TABLE_UPDATE_DATA_ROW](localState, { 'Column 1': 'TEST', id: localState.dataRowKeys[0] });
    expect(localState.dataRowObj[localState.dataRowKeys[0]]['Column 1']).toBe('TEST');
    mutations[types.MUTATE_TABLE_DELETE_DATA_ROW](localState, localState.dataRowKeys[0]);
    expect(localState.dataRowKeys.length).toBe(0);
  });

  it('MUTATE_CLEAR_TABLE_FORM', () => {
    const col = { ...localState.columnsListObj[localState.columnKeys[0]] };
    col.name = 'colName';
    mutations[types.MUTATE_TABLE_UPDATE_COLUMN](localState, col);
    mutations[types.MUTATE_TABLE_ADD_DATA_ROW](localState);
    mutations[types.MUTATE_TABLE_UPDATE_DATA_ROW](localState, { 'Column 1': 'TEST', id: localState.dataRowKeys[0] });
    expect(localState).not.toEqual(initialState());
    mutations[types.MUTATE_CLEAR_TABLE_FORM](localState);

    const initial = initialState();
    expect(localState.name).toEqual(initial.name);
    expect(localState.data).toEqual(initial.data);
    expect(localState.dataRowKeys.length).toBe(0);
    expect(localState.dataRowObj).toEqual({});
    expect(localState.columnKeys.length).toBe(1);
    expect(localState.columnsListObj['Column 1']).toBeDefined();
    expect(localState.colCounter).toBe(1);
  });
});
