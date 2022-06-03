<template>
  <div>
    <div class="row">
      <div class="col-xs-12">
        <div
          v-if="selectedFields.length && Object.keys(users).length"
          class="form-inline"
        >
          <select
            v-model="user"
            class="form-control input-sm"
          >
            <option
              value=""
              disabled
              selected
            >
              Select User
            </option>
            <option value="project">
              project
            </option>
            <option
              v-for="(userName, id) in users"
              :key="id"
              :value="id"
            >
              {{ userName }}
            </option>
          </select>
          <select
            v-model="selectedField"
            class="form-control input-sm"
          >
            <option
              value=""
              disabled
              selected
            >
              Select Field
            </option>
            <option
              v-for="field in selectedFields"
              :key="field"
              :value="field"
            >
              {{ field }}
            </option>
          </select>
          <button
            class="btn btn-primary btn-sm"
            :disabled="waiting || !user || !selectedField"
            @click="show(selectedField, user, projectId)"
          >
            Show
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="waiting || stats.length"
    >
      <div class="row">
        <div class="col-xs-12">
          <gig-spinner v-if="waiting" />
          <div v-else>
            <component
              :is="displayComponent"
              v-bind="fields[activeField].config"
              :stats="stats"
            />
          </div>
        </div>
      </div>
      <div
        v-if="!waiting && editable"
        class="row"
      >
        <div class="col-xs-12">
          <div class="form-inline">
            <input
              v-model="inputProjectName"
              type="text"
              class="form-control input-sm"
              placeholder="Enter Project Name to Delete"
            >
            <button
              class="btn btn-danger btn-sm"
              :disabled="projectName !== inputProjectName"
              @click="deleteStats(selectedField, user, projectId)"
            >
              Delete <strong>{{ activeField }}</strong> stats for <strong>{{ user==='project' ? user : users[activeUser] }}</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ConfusionMatrix from './confusion_matrix.vue';
import AccuracyTable from './accuracy_table.vue';
import GigSpinner from '../common/gig_spinner.vue';

function setStatsQueryParams (url, userId, projectId, field) {
  if (userId !== 'project') {
    url.searchParams.append('user_id', userId);
  }
  url.searchParams.append('field', field);
  url.searchParams.append('project_id', projectId);
}

export default {

  components: {
    ConfusionMatrix,
    AccuracyTable,
    GigSpinner
  },

  props: {
    users: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Object,
      default: () => {}
    },
    csrfToken: {
      type: String
    },
    editable: {
      type: Boolean,
      default: false
    },
    projectId: Number
  },

  data () {
    return {
      user: '',
      selectedField: '',
      activeField: '',
      activeUser: '',
      stats: [],
      displayComponent: null,
      waiting: false,
      projectName: '-',
      inputProjectName: ''
    };
  },

  computed: {
    selectedFields () {
      return Object.keys(this.fields).sort();
    }
  },

  mounted () {
    this.projectName = window.location.pathname.split('/')[2];
  },

  methods: {
    async show (selectedField, user, projectId) {
      this.waiting = true;
      this.activeField = selectedField;
      this.activeUser = user;

      const url = new URL('/api/performancestats', window.location.href);
      setStatsQueryParams(url, user, projectId, selectedField);
      url.searchParams.append('all', 1);
      try {
        const res = await fetch(url);
        this.stats = await res.json();
      } catch (e) {
        this.stats = [];
        window.pybossaNotify('An Error Occurred.', true, 'error');
      } finally {
        this.waiting = false;
      }
      this.showStats();
    },

    async deleteStats (selectedField, user, projectId) {
      this.waiting = true;
      const url = new URL(window.location.href);
      setStatsQueryParams(url, user, projectId, selectedField);
      try {
        const res = await fetch(url, {
          method: 'delete',
          headers: {
            'X-CSRF-Token': this.csrfToken,
            'content-type': 'application/json'
          }
        });
        if (res.ok) {
          this.stats = [];
          this.inputProjectName = '';
          window.pybossaNotify('Stats Deleted.', true, 'success');
        } else {
          window.pybossaNotify('An Error Occurred.', true, 'error');
        }
      } catch (e) {
        window.pybossaNotify('An Error Occurred.', true, 'error');
      } finally {
        this.waiting = false;
      }
    },

    showStats () {
      this.displayComponent = {
        'categorical': 'ConfusionMatrix',
        'freetext': 'AccuracyTable'
      }[this.fields[this.selectedField].type];
    }
  }
};
</script>
