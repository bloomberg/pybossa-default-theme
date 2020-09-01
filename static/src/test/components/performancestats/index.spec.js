import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import PerformanceStats from '../../../components/performancestats/index';

const localVue = createLocalVue();

const propsData = {
  users: { 1: 'user1', 2: 'user2' },
  fields: {
    field_1: {
      type: 'freetext'
    },
    field_2: {
      type: 'categorical',
      config: {
        labels: ['A', 'B', 'C']
      }
    }
  }
};

describe('performancestats', () => {
  let fetch;
  let notify;

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('loads', () => {
    const wrapper = shallowMount(PerformanceStats, { localVue, propsData });
    const dropdowns = wrapper.findAll('select');
    expect(dropdowns).toHaveLength(2);
  });

  it('displays data', async () => {
    fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => [{
        info: {
          wrong: 0,
          right: 4
        },
        user_id: 1,
        field: 'field_1',
        project_id: 2,
        stat_type: 'accuracy',
        id: 3
      }]
    }));
    const wrapper = shallowMount(PerformanceStats, { localVue, propsData });
    wrapper.setData({ user: 'user_1', selectedField: 'field_1' });
    const show = wrapper.find('button');
    show.trigger('click');
    await localVue.nextTick();
  });

  it('displays data error', async () => {
    fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => { throw new Error('error'); }
    }));
    const wrapper = shallowMount(PerformanceStats, { localVue, propsData });
    wrapper.setData({ user: 'user_1', selectedField: 'field_1' });
    const show = wrapper.find('button');
    show.trigger('click');
    await localVue.nextTick();
    expect(notify.mock.calls).toHaveLength(1);
    const [ msg, dismissable, status ] = notify.mock.calls[0];
    expect(msg).toBe('An Error Occurred.');
    expect(dismissable).toBe(true);
    expect(status).toBe('error');
  });

  it('deletes stats', async () => {
    fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => [{
        info: {
          wrong: 0,
          right: 4
        },
        user_id: 1,
        field: 'field_1',
        project_id: 2,
        stat_type: 'accuracy',
        id: 3
      }]
    }));
    const wrapper = mount(PerformanceStats, { localVue, propsData });
    wrapper.setData({ user: 'user_1', selectedField: 'field_1' });
    const show = wrapper.find('button');
    show.trigger('click');
    await localVue.nextTick();
  });
});
