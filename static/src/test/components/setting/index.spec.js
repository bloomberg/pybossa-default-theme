
import { shallowMount, createLocalVue } from '@vue/test-utils';
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

  it('load empty data', () => {
    propsData = {
      csrfTRoken: null,
      externalConfig: {},
      externalConfigForm: []
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(0);
    const button = wrapper.findAll('button');
    expect(button).toHaveLength(1);
  });

  it('show assigned users config', () => {
    propsData = {
        csrfTRoken: null,
        assignUsers: [],
        allUsers: [{ id: 1, fullname: 'user' }]
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(2);
  });

  it('show data access config', () => {
    propsData = {
        csrfTRoken: null,
        dataAccess: [],
        validAccessLevels: ['L1', 'L2', 'L3', 'L4']
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(5);
  });

  it('show external config', () => {
    propsData = {
      csrfTRoken: null,
      externalConfig: { gigwork_poller: { target_bucket: 'bcos bucket' } },
      externalConfigForm: { gigwork_poller: { display: 'display', fields: [{ 'type': 'TextField', name: 'target_bucket' }] } }
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(1);
  });

  it('render data to show data access and assign users', () => {
    propsData = {
      csrfTRoken: null,
      dataAccess: ['L1'],
      assignUsers: [{ id: 1, fullname: 'user1' }],
      allUsers: [{ id: 1, fullname: 'user1' }],
      externalConfig: {},
      validAccessLevels: ['L1', 'L2', 'L3', 'L4']
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(8);
  });

  it('add assigned user', () => {
    propsData = {
      csrfTRoken: null,
      assignUsers: [{ id: 1, fullname: 'user1' }],
      allUsers: [{ id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' }]
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    expect(wrapper.findAll('p')).toHaveLength(4);
    const user2 = wrapper.findAll('p').at(2);
    user2.trigger('click');
    expect(wrapper.findAll('p')).toHaveLength(5);
  });

  it('remove assigned user', () => {
    propsData = {
      csrfTRoken: null,
      assignUsers: [{ id: 1, fullname: 'user1' }],
      allUsers: [{ id: 1, fullname: 'user1' }]
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    expect(wrapper.findAll('p')).toHaveLength(3);
    const user1 = wrapper.findAll('p').at(2);
    user1.trigger('click');
    expect(wrapper.findAll('p')).toHaveLength(2);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    propsData = {
      csrfTRoken: null,
      dataAccess: [],
      assignUsers: [],
      allUsers: [],
      externalConfig: { gigwork_poller: { target_bucket: null } }
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
  });

  it('saves config fails', async () => {
    fetch.mockImplementation((arg) => ({
      ok: false
    }));
    propsData = {
      csrfTRoken: null,
      dataAccess: [],
      assignUsers: [],
      allUsers: [],
      externalConfig: { gigwork_poller: { target_bucket: null } }
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
  });
});