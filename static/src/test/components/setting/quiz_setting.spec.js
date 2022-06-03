import { createLocalVue, mount } from '@vue/test-utils';
import quizConfig from '../../../components/setting/quiz_setting.vue';

const localVue = createLocalVue();

describe('quizConfig', () => {
  let fetch;
  const user1 = { 'fullname': 'user', 'id': 1, 'quiz': { 'config': { 'completion_mode': 'short_circuit', 'csrf_token': '', 'enabled': false, 'passing': 7, 'questions': 7, 'short_circuit': true }, 'result': { 'right': 0, 'wrong': 0 }, 'status': 'not_started' } };
  const user2 = { 'fullname': 'worker1', 'id': 2, 'quiz': { 'config': { 'completion_mode': 'all_questions', 'csrf_token': '', 'enabled': true, 'passing': 4, 'questions': 4, 'short_circuit': false }, 'result': { 'right': 0, 'wrong': 0 }, 'status': 'in_progress' } };
  const user3 = { 'fullname': 'worker2', 'id': 3, 'quiz': { 'config': { 'completion_mode': 'all_questions', 'csrf_token': '', 'enabled': false, 'passing': 7, 'questions': 7, 'short_circuit': false }, 'result': { 'right': 0, 'wrong': 0 }, 'status': 'not_started' } };
  const initialResponse = { 'all_user_quizzes': [user1, user2, user3],
    'form': { 'completion_mode': 'all_questions', 'enabled': true, 'errors': {}, 'passing': 4, 'questions': 4 },
    'n_gold_unexpired': 4,
    'quiz_mode_choices': [['all_questions', 'Present all the quiz questions'], ['short_circuit', 'End as soon as pass/fail status is known']] };

  const afterSaveResponse = { 'all_user_quizzes': [user1, user2, user3],
    'flash': 'Configuration updated successfully',
    'form': { 'completion_mode': 'short_circuit', 'enabled': false, 'errors': {}, 'passing': 1, 'questions': 1 },
    'n_gold_unexpired': 5,
    'quiz_mode_choices': [['all_questions', 'Present all the quiz questions'], ['short_circuit', 'End as soon as pass/fail status is known']],
    'status': 'success' };

  const initialResponseWithErrors = { 'all_user_quizzes': [user1, user2, user3],
    'form': { 'completion_mode': 'all_questions', 'enabled': false, 'errors': { 'passing': ['error passings'] }, 'passing': 10, 'questions': 4 },
    'n_gold_unexpired': 4,
    'quiz_mode_choices': [['all_questions', 'Present all the quiz questions'], ['short_circuit', 'End as soon as pass/fail status is known']] };

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
  });

  it('fetch data', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(initialResponse)
    }));
    const wrapper = mount(quizConfig);
    await localVue.nextTick();

    expect(wrapper.vm.model.enabled).toBeTruthy();
    expect(wrapper.vm.model.questions).toBe(4);
    expect(wrapper.vm.model.passing).toBe(4);
    expect(wrapper.vm.model.n_gold_unexpired).toBe(4);
    expect(wrapper.vm.model.completion_mode).toBe('all_questions');
    expect(wrapper.vm.dataLoaded).toBeTruthy();
    /* expect(wrapper.vm.quizModeChoices).toEqual({
          'all_questions': 'Present all the quiz questions',
          'short_circuit': 'End as soon as pass/fail status is known'
    }); */
    expect(wrapper.vm.users['1']).toEqual(user1);
    expect(wrapper.vm.users['2']).toEqual(user2);
    expect(wrapper.vm.users['3']).toEqual(user3);
  });

  it('save data', async () => {
    fetch.mockImplementationOnce((arg) => ({
      ok: true,
      json: () => Promise.resolve(initialResponse)
    })).mockImplementationOnce((arg) => ({
      ok: true,
      json: () => Promise.resolve(afterSaveResponse)
    }));

    const wrapper = mount(quizConfig);

    await localVue.nextTick();
    expect(wrapper.vm.model.enabled).toBeTruthy();
    expect(wrapper.vm.model.questions).toBe(4);
    expect(wrapper.vm.model.passing).toBe(4);
    expect(wrapper.vm.model.n_gold_unexpired).toBe(4);
    expect(wrapper.vm.model.completion_mode).toBe('all_questions');
    expect(wrapper.vm.dataLoaded).toBeTruthy();
    expect(wrapper.vm.users['1']).toEqual(user1);
    expect(wrapper.vm.users['2']).toEqual(user2);
    expect(wrapper.vm.users['3']).toEqual(user3);
    await localVue.nextTick();

    window.pybossaNotify = jest.fn();
    wrapper.vm.save();

    await localVue.nextTick();
    expect(wrapper.vm.model.enabled).toBeFalsy();
    expect(wrapper.vm.model.questions).toBe(1);
    expect(wrapper.vm.model.passing).toBe(1);
    expect(wrapper.vm.model.n_gold_unexpired).toBe(5);
    expect(wrapper.vm.model.completion_mode).toBe('short_circuit');
    expect(wrapper.vm.dataLoaded).toBeTruthy();
  });

  it('save data error banner displayed', async () => {
    fetch.mockImplementationOnce((arg) => ({
      ok: true,
      json: () => Promise.resolve(initialResponse)
    })).mockImplementationOnce((arg) => ({
      ok: false,
      json: () => Promise.resolve(afterSaveResponse)
    }));

    const wrapper = mount(quizConfig);

    await localVue.nextTick();
    expect(wrapper.vm.model.enabled).toBeTruthy();
    expect(wrapper.vm.model.questions).toBe(4);
    expect(wrapper.vm.model.passing).toBe(4);
    expect(wrapper.vm.model.n_gold_unexpired).toBe(4);
    expect(wrapper.vm.model.completion_mode).toBe('all_questions');
    expect(wrapper.vm.dataLoaded).toBeTruthy();
    expect(wrapper.vm.users['1']).toEqual(user1);
    expect(wrapper.vm.users['2']).toEqual(user2);
    expect(wrapper.vm.users['3']).toEqual(user3);
    await localVue.nextTick();
    const notify = window.pybossaNotify = jest.fn();

    wrapper.vm.save();
    await localVue.nextTick();

    expect(notify.mock.calls).toHaveLength(1);
  });

  it('get data error banner displayed', async () => {
    const notify = window.pybossaNotify = jest.fn();

    fetch.mockImplementationOnce((arg) => ({
      ok: false,
      json: () => Promise.resolve(initialResponse)
    }));

    const wrapper = mount(quizConfig);
    await localVue.nextTick();
    expect(notify.mock.calls).toHaveLength(1);
    expect(wrapper.vm.model.enabled).toBeFalsy();
    expect(wrapper.vm.model.questions).toBe(0);
    expect(wrapper.vm.model.passing).toBe(0);
    expect(wrapper.vm.model.n_gold_unexpired).toBe(0);
    expect(wrapper.vm.model.completion_mode).toBe('');
    expect(wrapper.vm.dataLoaded).toBeFalsy();
    expect(wrapper.vm.quizModeChoices).toEqual({});
    expect(wrapper.vm.users).toEqual({});
  });

  it('get server error banner displayed', async () => {
    const notify = window.pybossaNotify = jest.fn();

    fetch.mockImplementationOnce((arg) => ({
      ok: true,
      json: () => 'some unexpected response'
    }));
    mount(quizConfig);
    await localVue.nextTick();
    expect(notify.mock.calls).toHaveLength(1);
    expect(notify.mock.calls[0][0]).toBe('An error occurred on the server.');
  });

  it('save server error banner displayed', async () => {
    fetch.mockImplementationOnce((arg) => ({
      ok: true,
      json: () => Promise.resolve(initialResponse)
    })).mockImplementationOnce((arg) => ({
      ok: true,
      json: () => 'some unexpected response'
    }));

    const wrapper = mount(quizConfig);

    await localVue.nextTick();
    expect(wrapper.vm.model.enabled).toBeTruthy();
    expect(wrapper.vm.model.questions).toBe(4);
    expect(wrapper.vm.model.passing).toBe(4);
    expect(wrapper.vm.model.n_gold_unexpired).toBe(4);
    expect(wrapper.vm.model.completion_mode).toBe('all_questions');
    expect(wrapper.vm.dataLoaded).toBeTruthy();

    expect(wrapper.vm.users['1']).toEqual(user1);
    expect(wrapper.vm.users['2']).toEqual(user2);
    expect(wrapper.vm.users['3']).toEqual(user3);
    await localVue.nextTick();

    const notify2 = window.pybossaNotify = jest.fn();
    wrapper.vm.save();

    await localVue.nextTick();
    expect(notify2.mock.calls).toHaveLength(1);
    expect(notify2.mock.calls[0][0]).toBe('An error occurred on the server.');
    });

    it('getProjectName', async () => {
      global.window = Object.create(window);
      const url = 'http://localhost:5000/project/newquiz/';
      Object.defineProperty(window, 'location', {
        value: {
          href: url
        }
      });
      const wrapper = mount(quizConfig);
      await localVue.nextTick();
      expect(wrapper.vm.getProjectName()).toBe('newquiz');
    });

    it('updateUsers', async () => {
      const wrapper = mount(quizConfig);
      await localVue.nextTick();
      wrapper.vm.updateUsers({ id: '1', name: 'Lucas' });
      expect(wrapper.vm.users['1']).toEqual({ id: '1', name: 'Lucas' });
    });

    it('onModelUpdate test valid form', async () => {
      fetch.mockImplementation((arg) => ({
        ok: true,
        json: () => Promise.resolve(initialResponseWithErrors)
      }));
      const wrapper = mount(quizConfig);
      await localVue.nextTick();
      expect(wrapper.html().includes('The number should not be larger than questions per quiz! Maximum: 4')).toBeFalsy();
      expect(wrapper.html().includes('The number should not be smaller than correct answers per quiz! Minimum: 10')).toBeFalsy();
      wrapper.vm.onModelUpdate();
      expect(wrapper.html().includes('The number should not be larger than questions per quiz! Maximum: 4')).toBeTruthy();
      expect(wrapper.html().includes('The number should not be smaller than correct answers per quiz! Minimum: 10')).toBeTruthy();
    });
});
