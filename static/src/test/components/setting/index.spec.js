import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import projectConfig from '../../../components/setting/index.vue';

const localVue = createLocalVue();

describe('projectConfig', () => {
  let fetch;
  let notify;
  let propsData;

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  let VALID_ACCESS_LEVELS = [ [ 'L1', 'L1' ], [ 'L2', 'L2' ], [ 'L3', 'L3' ], [ 'L4', 'L4' ] ];
  let EXT_CONF = { target_bucket: 'bucket' };

  it('fetch external config and access data', async () => {
    let response = {
      valid_access_levels: VALID_ACCESS_LEVELS,
      forms: {
        gigwork_poller: { display: 'test1', fields: [{ type: 'TextField', name: 'target_bucket' }] },
        hdfs: { display: 'test2', fields: [{ type: 'SelectField', name: 'cluster', choices: [('c1', 'option1')] }] }
      },
      external_config_dict: JSON.stringify(EXT_CONF),
      data_access: JSON.stringify(['L1'])
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));
    const wrapper = shallowMount(projectConfig);
    await localVue.nextTick();
    expect(wrapper.vm._data.validAccessLevels).toEqual(VALID_ACCESS_LEVELS);
    expect(wrapper.vm._data.externalConfigDict).toEqual(EXT_CONF);
    expect(wrapper.vm._data.dataAccessConfigured).toEqual(true);
  });

  it('search users', async () => {
    const wrapper = mount(projectConfig);
    wrapper.vm._data.assignee = [];
    wrapper.vm._data.users = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.searchResult = [{ id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' }];
    wrapper.vm._data.search = 'user2';
    const search = wrapper.findAll('input').at(0);
    search.trigger('keyup.enter');
    expect(wrapper.vm._data.searchResult).toHaveLength(1);
  });

  it('fetch assign-user data', async () => {
    let response = {
      project_users: ['1'],
      all_users: [{ id: 1, fullname: 'user1' }],
      valid_access_levels: VALID_ACCESS_LEVELS,
      external_config_dict: JSON.stringify(EXT_CONF),
      data_access: JSON.stringify(['L1'])
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));
    const wrapper = shallowMount(projectConfig);
    await localVue.nextTick();
    await localVue.nextTick();
    expect(wrapper.vm._data.assignee).toEqual(['1']);
    expect(wrapper.vm._data.users['1']['fullname']).toEqual('user1');
    expect(wrapper.vm._data.searchResult[0]['fullname']).toEqual('user1');
  });

it('load empty data', () => {
  propsData = {
    csrfTRoken: null,
    externalConfig: {},
    externalConfigForm: []
  };
  const wrapper = shallowMount(projectConfig, { propsData });
  expect(wrapper.vm._data.dataAccessConfigured).toEqual(false);
  expect(wrapper.vm._data.users).toEqual({});
});

  it('show external config', () => {
    const wrapper = shallowMount(projectConfig, { propsData });
    wrapper.vm._data.externalConfigDict = { target_bucket: 'bucket', cluster: 'c1' };
    wrapper.vm._data.inputFields = {
      gigwork_poller: { display: 'test1', fields: [{ type: 'TextField', name: 'target_bucket' }] },
      hdfs: { display: 'test2', fields: [{ type: 'SelectField', name: 'cluster', choices: [('c1', 'option1')] }] }
    };
    expect(wrapper.findAll('p')).toHaveLength(4);
    expect(wrapper.findAll('input')).toHaveLength(2);
    expect(wrapper.findAll('select')).toHaveLength(2);
  });

  it('add assigned user', () => {
    const wrapper = shallowMount(projectConfig);
    wrapper.vm._data.assignee = ['1'];
    wrapper.vm._data.users = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.searchResult = [{ id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' }];

    expect(wrapper.findAll('p')).toHaveLength(5);
    const user2 = wrapper.findAll('p').at(2);
    user2.trigger('click');
    expect(wrapper.findAll('p')).toHaveLength(6);
  });

  it('remove assigned user', () => {
    const wrapper = shallowMount(projectConfig);
    wrapper.vm._data.assignee = ['1'];
    wrapper.vm._data.users = { 1: { id: 1, fullname: 'user' } };
    wrapper.vm._data.searchResult = [{ id: 1, fullname: 'user' }];

    expect(wrapper.findAll('p')).toHaveLength(4);
    const user1 = wrapper.findAll('p').at(2);
    user1.trigger('click');
    expect(wrapper.findAll('p')).toHaveLength(3);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    const wrapper = shallowMount(projectConfig);
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(2);
    expect(notify.mock.calls).toHaveLength(2);
  });

  it('saves config fails', async () => {
    fetch.mockImplementation((arg) => ({
      ok: false
    }));
    const wrapper = shallowMount(projectConfig);
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(2);
    expect(notify.mock.calls).toHaveLength(2);
  });

  it('saves config fails wit flash error', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ flash: 'error', 'status': 'error' })
    }));
    const wrapper = shallowMount(projectConfig);
    const saveButton = wrapper.findAll('button').at(0);

    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(2);
    expect(notify.mock.calls).toHaveLength(3);
  });

  it('saves config fails wit flash error', async () => {
    let response = {
        status: 'error',
        flash: 'error occurred'
      };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));

    fetch
        .mockReturnValueOnce({ ok: true, json: () => Promise.resolve({ flash: 'success msg', 'status': 'success' }) })
        .mockReturnValueOnce({ ok: true, json: () => Promise.resolve(response) });
    const wrapper = shallowMount(projectConfig);
    wrapper.vm._data.dataAccessConfigured = true;
    const saveButton = wrapper.findAll('button').at(0);

    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(2);
    expect(notify.mock.calls).toHaveLength(3);
  });
});
