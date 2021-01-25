
import taskConfig from '../../../components/setting/task_setting.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();

describe('taskConfig', () => {
  let fetch;
  let notify;

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('fetch task scheduler data', async () => {
    let response = {
      form: {
        rand_within_priority: true,
        sched: 'default'
      }
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));
    const wrapper = shallowMount(taskConfig);
    await localVue.nextTick();
    await localVue.nextTick();
    await localVue.nextTick();
    expect(wrapper.vm._data.sched).toBe('default');
    expect(wrapper.vm._data.random).toBe(true);
  });

  it('fetch task redundancy data', async () => {
    let response = {
      default_task_redundancy: 2
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));
    const wrapper = shallowMount(taskConfig);
    await localVue.nextTick();
    await localVue.nextTick();
    await localVue.nextTick();
    expect(wrapper.vm._data.defaultRedundancy).toBe(2);
  });

  it('fetch task timeout data', async () => {
    let response = {
      form: {
        minutes: 10,
        seconds: 20
      }
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));
    const wrapper = shallowMount(taskConfig);
    await localVue.nextTick();
    await localVue.nextTick();
    await localVue.nextTick();
    expect(wrapper.vm._data.timeoutMinute).toBe(10);
    expect(wrapper.vm._data.timeoutSecond).toBe(20);
  });

  it('render fields', () => {
    const wrapper = shallowMount(taskConfig);
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(7);
    const button = wrapper.findAll('button');
    expect(button).toHaveLength(1);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    const wrapper = shallowMount(taskConfig);
    wrapper.vm._data.random = false;
    wrapper.vm._data.sched = 'default';
    wrapper.vm._data.timeoutMinute = 20;
    wrapper.vm._data.timeoutSecond = 10;
    wrapper.vm._data.defaultRedundancy = 2;
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(6);
    expect(notify.mock.calls).toHaveLength(4);
  });

  it('saves config - invalid input', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    const wrapper = shallowMount(taskConfig);
    wrapper.vm._data.random = false;
    wrapper.vm._data.sched = 'default';
    wrapper.vm._data.timeoutMinute = 'str';
    wrapper.vm._data.timeoutSecond = 10;
    wrapper.vm._data.defaultRedundancy = 2;
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(3);
    expect(notify.mock.calls).toHaveLength(4);
  });

  it('saves config fails', async () => {
    fetch.mockImplementation((arg) => ({
      ok: false
    }));
    const wrapper = shallowMount(taskConfig);
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(3);
    expect(notify.mock.calls).toHaveLength(4);
  });
});
