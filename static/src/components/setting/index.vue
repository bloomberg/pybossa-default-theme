<template>
  <div class="stats-config row">
    <GigSpinner v-if="waiting" />
    <div
      class="col-md-12"
      :style="waiting && 'opacity: 0.5'"
    >
      <div
        v-if="!isAdmin"
        class="form-group row"
      >
        <div class="col-md-5">
          <p>Authorized Services</p>
        </div>
        <div class="col-md-7 pull-right">
          <span>{{ authorizedServices.join(", ") }}</span>
        </div>
      </div>
      <div
        v-for="category in inputFields"
        :key="category.display"
        class="form-group row"
      >
        <div class="col-md-5">
          <p> {{ category.display }} </p>
        </div>
        <div class="col-md-7 pull-right">
          <div
            v-for="field in category.fields"
            :key="field.name"
          >
            <multiselect
              v-if="field.type==='MultiSelect'"
              v-model="externalConfigDict[field.name]"
              :options="field.choices"
              :multiple="true"
            />
            <input
              v-if="field.type==='TextField'"
              v-model="externalConfigDict[field.name]"
              :placeholder="field.label"
              type="text"
              class="form-control input-sm"
            >
            <select
              v-if="field.type==='SelectField'"
              v-model="externalConfigDict[field.name]"
              class="form-control input-sm"
            >
              <option
                v-for="choice in field.choices"
                :key="choice[0]"
                :value="choice[0]"
              >
                {{ choice[1] }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div
        v-if="Object.keys(users).length"
        class="form-group row"
      >
        <div class="col-md-5">
          <p> Assign Users </p>
        </div>
        <div class="col-md-7 pull-right">
          <table
            class="table table-striped table-hover"
            style="border: 1px ridge silver"
          >
            <thead>
              <tr class="title">
                <th style="border-right: 1px ridge silver; text-align: center">
                  All Users
                </th>
                <th style="text-align: center">
                  Assigned Users
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="assign-user-column">
                  <input
                    v-model="search"
                    class="form-group input-sm"
                    type="text"
                    placeholder="Search for name.."
                    style="min-width: 250px"
                    @keyup.enter="filter"
                  >
                  <div class="col-md-12 scroll">
                    <div
                      v-for="u in sortedUsers(searchResult)"
                      id="users"
                      :key="u.id"
                      :title="u.email_addr"
                      class="row"
                      :value="u"
                      @click="add($event, u)"
                    >
                      <p
                        v-if="assignee.includes(u.id)"
                        style="color:teal"
                      >
                        {{ u.fullname }}
                      </p>
                      <p v-else>
                        {{ u.fullname }}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="col-md-12 scroll">
                    <div
                      v-for="u in sortedUsers(assignee)"
                      id="users"
                      :key="u.id"
                      :title="u.email_addr"
                      class="row"
                      :value="u.id"
                      @click="remove($event, u.id)"
                    >
                      <p class="assigned-user">
                        {{ u.fullname }}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Auto Delete Completed Tasks After </p>
        </div>
        <div class="col-md-6 pull-right">
          <select
            v-model="completed_tasks_cleanup_days"
            class="form-control input-sm"
          >
            <option
              v-for="opt in [[null, 'None'], [30, '30 days'], [60, '60 days'], [90, '90 days'], [180, '180 days']]"
              :key="opt[0]"
              :value="opt[0]"
            >
              {{ opt[1] }}
            </option>
          </select>
        </div>
      </div>
      <div
        v-if="!validAccessLevels.length"
        class="form-group row"
      >
        <!-- enable editing of task submissions only on public platform -->
        <div class="col-md-6">
          <p> Allow Editing of Task Submissions </p>
        </div>
        <div class="col-md-6 pull-right">
          <label class="switch">
            <input
              v-model="allow_taskrun_edit"
              type="checkbox"
            >
            <span class="slider" />
          </label>
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
      csrfToken: null,
      assignee: [],
      users: {},
      dataAccessConfigured: false,
      validAccessLevels: [],
      search: '',
      searchResult: this.users,
      inputFields: [],
      externalConfigDict: {},
      waiting: false,
      completed_tasks_cleanup_days: null,
      allow_taskrun_edit: false,
      authorizedServices: [],
      isAdmin: false
    };
  },
  created () {
    this.getData();
  },
  methods: {
    hasLevel (level) {
      return this.dataAccessConfig.includes(level);
    },

    getAssignedUsers (assignedUsers) {
      let users = {};
      assignedUsers.forEach(function (u) {
        users[u.id] = u;
      });
      return users;
    },

    getUsers (allUsers) {
      return allUsers
        .filter(u => u.enabled)
        .reduce((users, u) => {
          users[u.id] = u;
          return users;
        }, {});
    },

    getURL (keyword) {
      let path = window.location.pathname;
      let res = path.split('/');
      res[res.length - 1] = keyword;
      return res.join('/');
    },

    sortedUsers (usersOrIds) {
      // Sorts an array of user objects or user ids.
      const isIds = typeof usersOrIds[0] !== 'object';
      const users = isIds ? usersOrIds.map(id => this.users[id]) : usersOrIds;

      // Sort the users by their last name.
      return users.filter(u => u).slice().sort((a, b) => {
        return a.last_name.localeCompare(b.last_name, undefined, { sensitivity: 'base' });
      });
    },

    add (event, ur) {
      if (!this.assignee.includes(ur.id)) {
        this.assignee.push(ur.id);
      }
    },

    remove (event, id) {
      this.assignee = this.assignee.filter(function (uid) {
        return uid !== id;
      });
    },

    filter () {
      let userList = Object.values(this.users);
      if (!this.search.length) {
        this.searchResult = userList;
      } else {
        this.searchResult = userList.filter(
          user => user.fullname.toLowerCase().includes(this.search.toLowerCase()));
      }
    },

    async getData () {
      try {
        this.waiting = true;
        const res = await fetch(this.getURL('project-config'), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const dataProjConfig = await res.json();
        this.csrfToken = dataProjConfig.csrf;
        if (dataProjConfig.valid_access_levels) {
            this.validAccessLevels = dataProjConfig.valid_access_levels;
        }
        this.inputFields = dataProjConfig.forms;
        this.externalConfigDict = JSON.parse(dataProjConfig.external_config_dict);
        this.authorizedServices = dataProjConfig.authorized_services;
        this.isAdmin = dataProjConfig.is_admin;
        if (JSON.parse(dataProjConfig.data_access).length > 0) {
            this.dataAccessConfigured = true;
        }
        if (this.dataAccessConfigured && this.validAccessLevels.length > 0) {
            const res = await fetch(this.getURL('assign-users'), {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
            credentials: 'same-origin'
            });
            const dataAssignUsers = await res.json();
            this.assignee = dataAssignUsers.project_users;
            this.users = this.getUsers(dataAssignUsers.all_users);
            this.searchResult = Object.values(this.users);
        }
        this.completed_tasks_cleanup_days = dataProjConfig.completed_tasks_cleanup_days || null;
        this.allow_taskrun_edit = dataProjConfig.allow_taskrun_edit || false;
      } catch (error) {
        window.pybossaNotify('Error reading project config.', true, 'error');
      } finally {
        this.waiting = false;
      }
    },

    async save () {
        let data = {};
        if (this.dataAccessConfigured && this.validAccessLevels.length > 0) {
            data = {
                config: this.externalConfigDict,
                select_users: this.assignee,
                completed_tasks_cleanup_days: this.completed_tasks_cleanup_days,
                allow_taskrun_edit: this.allow_taskrun_edit
            };
        } else {
            data = {
                config: this.externalConfigDict,
                completed_tasks_cleanup_days: this.completed_tasks_cleanup_days,
                allow_taskrun_edit: this.allow_taskrun_edit
            };
        }
        try {
            this.waiting = true;
            let validConfig = true;
            const projectRes = await fetch(this.getURL('project-config'), {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': this.csrfToken
                },
                credentials: 'same-origin',
                body: JSON.stringify(data)
            });

            if (projectRes.ok) {
                const projectData = await projectRes.json();
                if (projectData['status'] !== 'success') {
                    validConfig = false;
                    window.pybossaNotify(projectData['flash'], true, projectData['status']);
                }
            }

            if (this.dataAccessConfigured && this.validAccessLevels.length > 0) {
                const assignRes = await fetch(this.getURL('assign-users'), {
                    method: 'POST',
                    headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': this.csrfToken
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                });
                if (assignRes.ok) {
                    const assignData = await assignRes.json();
                    if (assignData['status'] !== 'success') {
                        validConfig = false;
                        window.pybossaNotify(assignData['flash'], true, assignData['status']);
                    }
                }
            }

            if (validConfig) {
                window.pybossaNotify('Configuration updated successfully', true, 'success');
            } else {
                window.pybossaNotify('An error occurred configuring project config.', true, 'error');
            }
        } catch (error) {
            window.pybossaNotify('An error occurred configuring project config.', true, 'error');
        } finally {
          this.waiting = false;
        }
    }
  }
};

</script>
<style scoped>

.scroll #users:hover {background-color: #ddd}
.scroll #users {padding-left: 10px; box-sizing: border-box;}
.scroll p {
  color: black;
  padding: 2px 2px;
  text-decoration: none;
  display: block;
}
.scroll {
  overflow-x: hidden;
  max-height: 150px;
  overflow-y: scroll;
}
.form-check-label p {
  margin-right:10px
}
.title {
  border-top: 1px ridge silver
}
#assign-user-column {
  border-right: 1px ridge silver; width:50%
}

</style>
