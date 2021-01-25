<template>
  <div class="stats-config row">
    <GigSpinner v-if="waiting" />
    <div
      class="col-md-12"
      :style="waiting && 'opacity: 0.5'"
    >
      <div class="form-group row">
        <div class="col-md-6">
          <p> Task Scheduler </p>
        </div>
        <div class="col-md-6 pull-right">
          <select
            v-model="sched"
            class="form-control input-sm"
          >
            <option
              v-for="opt in schedVariants"
              :key="opt[0]"
              :value="opt[0]"
            >
              {{ opt[1] }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Randomize Within Priority </p>
        </div>
        <div class="col-md-6 pull-right">
          <label class="switch">
            <input
              v-model="random"
              type="checkbox"
            >
            <span class="slider" />
          </label>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Timeout </p>
        </div>
        <div class="col-md-6 pull-right">
          <div class="input-group">
            <input
              id="timeout-form"
              v-model="timeoutMinute"
              type="text"
              class="form-control input-sm"
            >
            <span
              class="input-group-addon input-sm"
            > min </span>
            <input
              id="timeout-form"
              v-model="timeoutSecond"
              type="text"
              class="form-control input-sm"
            >
            <span
              class="input-group-addon input-sm"
            > sec </span>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Default Task Redundancy </p>
        </div>
        <div class="col-md-6 pull-right">
          <input
            v-model="defaultRedundancy"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Redundancy</p>
        </div>
        <div class="col-md-6 pull-right">
          <input
            v-model="currentRedundancy"
            type="text"
            class="form-control input-sm"
            placeholder="Change the number of required answers for all current tasks"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Gold Task Probability </p>
        </div>
        <div class="col-md-6 pull-right">
          <input
            v-model="goldtaskProbability"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Task Notification Threshold</p>
        </div>
        <div class="col-md-6 pull-right">
          <input
            v-model="remaining"
            type="text"
            class="form-control input-sm"
            placeholder="Notify when the number of remaining tasks is less than or equal to"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Task Notification Webhook URL</p>
        </div>
        <div class="col-md-6 pull-right">
          <input
            v-model="webhook"
            type="text"
            class="form-control input-sm"
            placeholder="Notification webhook URL"
          >
        </div>
      </div>
      <div>
        <button
          class="btn btn-sm btn-primary"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import GigSpinner from '../common/gig_spinner.vue';

export default {
  components: {
    GigSpinner
  },

  data () {
    return {
      waiting: false,
      csrfToken: '',
      sched: '',
      schedVariants: null,
      random: false,
      timeoutMinute: Math.floor(this.taskTimeout / 60),
      timeoutSecond: this.taskTimeout % 60,
      defaultRedundancy: null,
      currentRedundancy: null,
      goldtaskProbability: 0,
      remaining: 0,
      webhook: null
    };
  },

  created: function () {
    this.getData();
  },

  methods: {

    getURL (keyword) {
      let path = window.location.pathname;
      let res = path.split('/');
      res[res.length - 1] = keyword;
      return res.join('/');
    },

    _isIntegerNumeric: function (_n) {
        return Math.floor(_n) === _n;
    },

    async getData () {
      this.waiting = true;

      try {
        const res = await fetch(this.getURL('tasks/redundancy'), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.defaultRedundancy = data.default_task_redundancy;
        this.csrfToken = data.default_form.csrf;
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }

      try {
        const res = await fetch(this.getURL('tasks/timeout'), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.timeoutMinute = data.form.minutes;
        this.timeoutSecond = data.form.seconds;
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }

      try {
        const res = await fetch(this.getURL('tasks/scheduler'), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.sched = data.form.sched;
        this.random = data.form.rand_within_priority;
        this.schedVariants = data.sched_variants;
        this.goldtaskProbability = data.form.gold_task_probability;
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }

      try {
        const res = await fetch(this.getURL('tasks/task_notification'), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.remaining = data.form.remaining;
        this.webhook = data.form.webhook;
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }

      this.waiting = false;
    },

    async save () {
      try {
        this.waiting = true;

        let _defaultRedundancy = parseInt(this.defaultRedundancy);
        let _currentRedundancy = parseInt(this.currentRedundancy);
        let _minute = parseInt(this.timeoutMinute);
        let _second = parseInt(this.timeoutSecond);
        let data = {
              sched: this.sched,
              minutes: _minute,
              seconds: _second,
              default_n_answers: _defaultRedundancy,
              rand_within_priority: this.random,
              gold_task_probability: this.goldtaskProbability
              };
        const notificationData = {
          remaining: this.remaining,
          webhook: this.webhook
        };
        if (this.currentRedundancy !== null) {
          data['n_answers'] = _currentRedundancy;
        }
        if (!this._isIntegerNumeric(_minute) || !this._isIntegerNumeric(_second) ||
            !this._isIntegerNumeric(_defaultRedundancy) ||
            (this.currentRedundancy !== null && !this._isIntegerNumeric(_currentRedundancy))) {
          throw Error('Parameter is not a number!');
        }

        const timeoutRes = await fetch(this.getURL('tasks/timeout'), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify(data)
        });
        const redundancyRes = await fetch(this.getURL('tasks/redundancy'), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify(data)
        });
        const schedulerRes = await fetch('tasks/scheduler', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify(data)
        });
        const taskNotificationRes = await fetch('tasks/task_notification', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify(notificationData)
        });
        if (timeoutRes.ok && redundancyRes.ok && schedulerRes.ok && taskNotificationRes.ok) {
          const timeoutData = await timeoutRes.json();
          const redundancyData = await redundancyRes.json();
          const schedulerData = await schedulerRes.json();
          const taskNotificationData = await taskNotificationRes.json();
          if (schedulerData['status'] !== 'success') {
            window.pybossaNotify('scheduler config. ' + schedulerData['flash'], true, schedulerData['status']);
          } else if (timeoutData['status'] !== 'success') {
            window.pybossaNotify('timeout config. ' + timeoutData['flash'], true, timeoutData['status']);
          } else if (redundancyData['status'] !== 'success') {
            window.pybossaNotify('redundancy config. ' + redundancyData['flash'], true, redundancyData['status']);
          } else if (taskNotificationData['status'] !== 'success') {
            window.pybossaNotify('task notification config. ' + taskNotificationData['flash'], true, taskNotificationData['status']);
          } else {
            window.pybossaNotify('Configuration updated successfully', true, 'success');
          }
        } else {
          window.pybossaNotify('An error occurred configuring task config.', true, 'error');
        }
      } catch (error) {
        window.pybossaNotify('An error occurred configuring task config.', true, 'error');
      } finally {
        this.waiting = false;
      }
    }
  }
};

</script>
<style scoped>
.input-group-addon {
  width: 10%
}
#timeout-form {
  width:100%
}
</style>
