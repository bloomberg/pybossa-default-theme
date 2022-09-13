
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ownershipConfig from '../../../components/setting/ownership_setting.vue';

const localVue = createLocalVue();

describe('ownershipConfig', () => {
  let fetch;
  let notify;

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('fetch data', async () => {
    let response = {
      coowners_dict: [{ id: 1, fullname: 'user1' }],
      contacts_dict: [{ id: 1, fullname: 'user1' }],
      owner: { id: 1, fullname: 'user1' },
      form: { csrf: '' }
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));
    const wrapper = shallowMount(ownershipConfig);
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(0);
    expect(wrapper.vm._data.owner.id).toBe(1);
    expect(Object.keys(wrapper.vm._data.coowners)).toHaveLength(1);
    expect(Object.keys(wrapper.vm._data.contacts)).toHaveLength(1);
  });

  it('render fields - without other coowners', () => {
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' } };
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(8);
    const button = wrapper.findAll('button');
    expect(button).toHaveLength(3);
  });

  it('render fields - with other coowners', () => {
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(8);
  });

  it('search users', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({
        coowners_dict: [{ id: 1111, fullname: 'full name' }],
        contacts_dict: [{ id: 1111, fullname: 'full name' }],
        owner: { id: 1111, fullname: 'full name' },
        form: { csrf: 'csrf'},
        found: {
          coowners: [ { id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' } ],
          contacts: [ { id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' } ],
        }
      })
    }));
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.coownerResult = [];
    wrapper.vm._data.contactResult = [];
    expect(wrapper.findAll('p')).toHaveLength(8);
    const textBox = wrapper.findAll("input[type='text']").at(0); // Coowners query textbox
    textBox.element.value = 'test';
    textBox.trigger('input');
    const searchButton = wrapper.findAll('button').at(0); // Search users button
    searchButton.trigger('click');
    await localVue.nextTick();
    expect(wrapper.findAll('p')).toHaveLength(8); // valid search results
    expect(notify.mock.calls).toHaveLength(0); // no error alert
  });

  it('search users invalid', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ found: [{ id: 1111, fullname: 'found' }] })
    }));
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    expect(wrapper.findAll('p')).toHaveLength(8);
    const searchButton = wrapper.findAll('button').at(0); // Search users button
    searchButton.trigger('click');
    await localVue.nextTick();
    expect(notify.mock.calls).toHaveLength(2); // no search results
    expect(notify.mock.calls[0][0]).toEqual('Please enter a search query.'); // error alert
  });

  it('search contacts', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({
        coowners_dict: [{ id: 1111, fullname: 'full name' }],
        contacts_dict: [{ id: 1111, fullname: 'full name' }],
        owner: { id: 1111, fullname: 'full name' },
        form: { csrf: 'csrf'},
        found: {
          coowners: [ { id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' } ],
          contacts: [ { id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' } ],
        }
      })
    }));
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.coownerResult = [];
    wrapper.vm._data.contactResult = [];
    expect(wrapper.findAll('p')).toHaveLength(8);
    const textBox = wrapper.findAll("input[type='text']").at(1); // Contacts query text box
    textBox.element.value = 'test';
    textBox.trigger('input');
    const searchButton = wrapper.findAll('button').at(1); // Search contacts button
    searchButton.trigger('click');
    await localVue.nextTick();
    expect(wrapper.findAll('p')).toHaveLength(8); // valid search results
    expect(notify.mock.calls).toHaveLength(0); // no error alert
  });

  it('search contacts invalid', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ found: [{ id: 1111, fullname: 'found' }] })
    }));
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    expect(wrapper.findAll('p')).toHaveLength(8);
    const searchButton = wrapper.findAll('button').at(1); // Search contacts button
    searchButton.trigger('click');
    await localVue.nextTick();
    expect(notify.mock.calls).toHaveLength(2); // no search results
    expect(notify.mock.calls[0][0]).toEqual('Please enter a search query.'); // error alert
  });

  it('add coowners', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ found: [{ id: 1111, fullname: 'found' }] })
    }));
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' } };

    expect(wrapper.findAll('i')).toHaveLength(2);
    const searchButton = wrapper.findAll('button').at(0); // coowners button
    searchButton.trigger('click');
    await localVue.nextTick();
    const user = wrapper.findAll('p').at(5);
    user.trigger('click');
    expect(wrapper.findAll('i')).toHaveLength(2);
  });

  it('remove coowners', () => {
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };

    expect(wrapper.findAll('i')).toHaveLength(4);
    const icons = wrapper.findAll('i');
    expect(icons).toHaveLength(4);
    icons.at(0).trigger('click');
    expect(wrapper.findAll('i')).toHaveLength(3);
  });

  it('add contacts', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ found: [{ id: 1111, fullname: 'found' }] })
    }));
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' } };

    expect(wrapper.findAll('i')).toHaveLength(2);
    const searchButton = wrapper.findAll('button').at(1); // contacts button
    searchButton.trigger('click');
    await localVue.nextTick();
    const user = wrapper.findAll('p').at(5);
    user.trigger('click');
    expect(wrapper.findAll('i')).toHaveLength(2);
  });

  it('remove contacts', () => {
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };

    expect(wrapper.findAll('i')).toHaveLength(4);
    const icons = wrapper.findAll('i');
    expect(icons).toHaveLength(4);
    icons.at(2).trigger('click');
    expect(wrapper.findAll('i')).toHaveLength(3);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' } };

    const saveButton = wrapper.findAll('button').at(2);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(2);
    expect(notify.mock.calls).toHaveLength(2);
  });

  it('saves config fails', async () => {
    fetch.mockImplementation((arg) => ({
      ok: false
    }));
    const wrapper = shallowMount(ownershipConfig);
    wrapper.vm._data.owner = { id: 1, fullname: 'user1' };
    wrapper.vm._data.coowners = { 1: { id: 1, fullname: 'user1' } };
    wrapper.vm._data.contacts = { 1: { id: 1, fullname: 'user1' } };

    const saveButton = wrapper.findAll('button').at(2);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(2);
    expect(notify.mock.calls).toHaveLength(2);
  });
});
