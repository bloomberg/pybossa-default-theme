import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import RedundancyConfig from '../../../components/fieldsconfig/redundancy_config.vue';
import { storeSpecs } from '../../../components/fieldsconfig/store';
import { cloneDeep } from 'lodash';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('RedundancyConfig', () => {
  let store;
  let fetch;
  let notify;
  let consensusConfig = {
    consensus_threshold: 80,
    redundancy_config: 2,
    max_retries: 10
  };

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeSpecs));
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('fetch data', async () => {
    let response = {
      consensus_config: JSON.stringify(consensusConfig),
      answer_fields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retryForConsensus: false
        }
      }
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));
    const wrapper = shallowMount(RedundancyConfig, { store, localVue });
    await localVue.nextTick();
    expect(wrapper.vm._data.consensusThreshold).toBe(80);
    expect(wrapper.vm._data.redundancyConfig).toBe(2);
    expect(wrapper.vm._data.maxRetries).toBe(10);
  });

  it('does not load data', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retryForConsensus: false
        }
      }
    });
    const wrapper = shallowMount(RedundancyConfig, { store, localVue });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(0);
  });

  it('loads empty config', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: true
        }
      }
    });
    const wrapper = shallowMount(RedundancyConfig, { store, localVue });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(3);
  });

  it('load non-empty config', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: true
        }
      },
      consensus: consensusConfig
    });
    const wrapper = shallowMount(RedundancyConfig, { store, localVue });
    const p = wrapper.findAll('p');
    const button = wrapper.findAll('button');
    expect(button).toHaveLength(1);
    expect(p).toHaveLength(3);
  });

  it('save config (without consensus config)', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ flash: 'hello', status: 'success' })
    }));
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: false
        }
      }
    });
    const wrapper = shallowMount(RedundancyConfig, { store, localVue });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(2);
    expect(notify.mock.calls).toHaveLength(2);
  });

  it('save config (with consensus config)', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ flash: 'hello', status: 'success' })
    }));
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: false
        }
      },
      consensus: consensusConfig
    });
    const wrapper = shallowMount(RedundancyConfig, { store, localVue });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(2);
    expect(notify.mock.calls).toHaveLength(2);
  });

  it('save incorrect config', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: true
        }
      },
      consensus: {
        consensus_threshold: 80,
        max_retries: 8,
        redundancy_config: 'wrong'
      }
    });
    const wrapper = shallowMount(RedundancyConfig, { store, localVue });
    expect(wrapper.findAll('.error-msg')).toHaveLength(0);
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    expect(wrapper.findAll('.error-msg')).toHaveLength(1);
  });

  it('save config fails', async () => {
    fetch.mockImplementation((arg) => ({
      ok: false
    }));
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: false
        }
      }
    });
    const wrapper = shallowMount(RedundancyConfig, { store, localVue });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(2);
    expect(notify.mock.calls).toHaveLength(2);
  });

  it('test validation logic directly', () => {
    const wrapper = shallowMount(RedundancyConfig, { store, localVue });
    let valid = wrapper.vm._write(80, 2, 10, 70); // should pass
    expect(valid).toBe(true);

    valid = wrapper.vm._write(101, 2, 10, 70); // threshold out of range
    expect(valid).toBe(false);
    expect(wrapper.vm.errorMsg).toContain('within 50 - 100');

    valid = wrapper.vm._write(80, -1, 10, 70); // redundancy should be positive
    expect(valid).toBe(false);
    expect(wrapper.vm.errorMsg).toContain('positive integer');
  });
});
