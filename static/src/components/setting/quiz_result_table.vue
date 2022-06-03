<template>
  <div>
    <table
      v-if="Object.values(users).length > 0"
      id="quiz_result_table"
      class="table table-bordered table-striped table-hover"
    >
      <thead>
        <tr>
          <th>
            <input
              id="all"
              type="checkbox"
              :value="allRowsSelected"
              :checked="allRowsSelected"
              @change="updateAllEnable($event)"
            >
            Enable
          </th>
          <th>User</th>
          <th>Status</th>
          <th>Completion Mode</th>
          <th>Right</th>
          <th>Wrong</th>
          <th>Questions</th>
          <th>Passing</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          :value="user"
        >
          <td>
            <input
              :id="user.id"
              v-model="user.quiz.config.enabled"
              :value="user.quiz.config.enabled"
              :check="user.quiz.config.enabled"
              type="checkbox"
              @change="checkEnable($event, user.id)"
            >
          </td>
          <td>{{ user.fullname }}</td>
          <td :class="{'bg-success': !user.quiz.config.reset && user.quiz.status == 'passed', 'bg-danger': !user.quiz.config.reset && user.quiz.status == 'failed' }">
            {{ getStatus(user) }}
          </td>
          <td>{{ !user.quiz.config.reset ? quizModeChoices[user.quiz.config.completion_mode]: quizModeChoices[model.completion_mode] }}</td>
          <td>{{ !user.quiz.config.reset ? user.quiz.result.right : 0 }}</td>
          <td>{{ !user.quiz.config.reset ? user.quiz.result.wrong : 0 }}</td>
          <td>{{ !user.quiz.config.reset ? user.quiz.config.questions : model.questions }}</td>
          <td>{{ !user.quiz.config.reset ? user.quiz.config.passing : model.passing }}</td>
          <td>
            <button
              class="btn btn-sm btn-primary"
              :disabled="!enableReset(user.id)"
              @click="user.quiz.config.reset = !user.quiz.config.reset"
            >
              {{ users[user.id].quiz.config.reset ? 'Undo' : 'Reset' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  props: {
    model: {
      type: Object,
      default () { return {}; }
    },
    users: {
      type: Object,
      default () { return {}; }
    },
    quizModeChoices: {
      type: Object,
      default () { return {}; }
    }
  },
  data () {
    return { };
  },
  computed: {
    allRowsSelected () {
      for (let id in this.users) {
        if (!this.users[id].quiz.config.enabled) {
          return false;
        }
      }
      return true;
    }
  },
  methods: {
    getStatus (user) {
      const statusMapping = {
          'in_progress': 'In Progress',
          'not_started': 'Not Started',
          'failed': 'Failed',
          'passed': 'Passed' };
      let status = user.quiz.status;
      if (user.quiz.config.reset) {
        status = user.quiz.config.enabled ? 'in_progress' : 'not_started';
      }
      return statusMapping[status];
    },

    updateUsers (user) {
      this.$emit('updateUsers', user);
    },

    checkEnable (event, id) {
      this.updateUsers(this.users[id]);
    },

    updateAllEnable (event) {
      Object.values(this.users).forEach((user) => {
            user.quiz.config.enabled = event.target.checked;
            this.updateUsers(this.users[user.id]);
      });
    },

    reset (event, id) {
      this.updateUsers(this.users[id]);
      // eslint-disable-next-line vue/no-mutating-props
      this.users[id].quiz.config.reset = !this.users[id].quiz.config.reset;
    },

    enableReset (id) {
      return this.users[id].quiz.config.questions !== this.model.questions ||
      this.users[id].quiz.config.passing !== this.model.passing ||
      this.users[id].quiz.result.right > 0 || this.users[id].quiz.result.wrong > 0 ||
      this.users[id].quiz.status !== 'not_started' ||
      this.model.completion_mode !== this.users[id].quiz.config.completion_mode;
    }

  }
};
</script>
