<template>
  <div class="stats-config row">
    <GigSpinner v-if="waiting" />
    <div
      class="col-md-12"
      :style="waiting && 'opacity: 0.5'"
    >
      <div class="form-group row">
        <div class="col-md-4">
          <p> Project Owner </p>
        </div>
        <div class="col-md-8 pull-right">
          <p> {{ owner.fullname }} </p>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Co-owners </p>
        </div>
        <div class="col-md-8 pull-right">
          <div v-if="Object.keys(coowners).length">
            <p style="display: inline-block; word-break: normal; line-height: 35px;">
              <span
                v-for="u in coowners"
                :key="u.name"
                class=" label label-lg label-info"
                style="display: inline-block"
              >
                {{ u.fullname }}
                <i
                  v-if="u.id!==owner.id"
                  class="fa fa-times"
                  aria-hidden="true"
                  @click="removeCoowner($event, u.id)"
                />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Manage Co-owners </p>
        </div>
        <div class="col-md-8 pull-right">
          <div class="input-group">
            <input
              v-model="coownerQuery"
              type="text"
              class="form-control input-sm"
              placeholder="Try with full name or nick name"
            >
            <span class="input-group-append">
              <button
                class="btn btn-sm btn-primary "
                @click="searchCoowners"
              >
                <i class="fa fa-search" />
                Search
              </button>
            </span>
          </div>
          <div
            v-if="coownerResult.length"
            class="dropdown-content"
          >
            <div
              class="scroll"
              style="max-height: 150px;"
            >
              <div
                v-for="u in coownerResult"
                :key="u.id"
                :value="u"
                class="row"
                @click="addCoowner($event, u)"
              >
                <p> {{ u['fullname'] }} </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Email Contacts </p>
        </div>
        <div class="col-md-8 pull-right">
          <div v-if="Object.keys(contacts).length">
            <p style="display: inline-block; word-break: normal; line-height: 35px;">
              <span
                v-for="u in contacts"
                :key="u.name"
                class=" label label-lg label-info"
                style="display: inline-block"
              >
                {{ u.fullname }}
                <i
                  v-if="u.id!==owner.id"
                  class="fa fa-times"
                  aria-hidden="true"
                  @click="removeContact($event, u.id)"
                />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Manage Email Contacts </p>
        </div>
        <div class="col-md-8 pull-right">
          <div class="input-group">
            <input
              v-model="contactQuery"
              type="text"
              class="form-control input-sm"
              placeholder="Try with full name or nick name"
            >
            <span class="input-group-append">
              <button
                class="btn btn-sm btn-primary "
                @click="searchContacts"
              >
                <i class="fa fa-search" />
                Search
              </button>
            </span>
          </div>
          <div
            v-if="contactResult.length"
            class="dropdown-content"
          >
            <div
              class="scroll"
              style="max-height: 150px;"
            >
              <div
                v-for="u in contactResult"
                :key="u.id"
                :value="u"
                class="row"
                @click="addContact($event, u)"
              >
                <p> {{ u['fullname'] }} </p>
              </div>
            </div>
          </div>
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
import Vue from 'vue';
import GigSpinner from '../common/gig_spinner.vue';

export default {
  components: {
    GigSpinner
  },

  data () {
    return {
      owner: {},
      coowners: {},
      contacts: {},
      coownerResult: [],
      contactResult: [],
      coownerQuery: '',
      contactQuery: '',
      waiting: false
    };
  },

  created () {
    this.getData();
  },

  methods: {

    initialize (data) {
      this.coowners = this.getUsers(data.coowners_dict);
      this.contacts = this.getUsers(data.contacts_dict);
      this.owner = data.owner;
      this.csrfToken = data.form.csrf;
    },

    getUsers (data) {
      let users = {};
      data.forEach(function (u) {
        users[u.id] = u;
      });
      return users;
    },

    getURL () {
      //
      let path = window.location.pathname;
      let res = path.split('/');
      res[res.length - 1] = 'coowners';
      return res.join('/');
    },

    async search (user, contact) {
      const res = await fetch(this.getURL(), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-CSRFToken': this.csrfToken
        },
        credentials: 'same-origin',
        body: JSON.stringify({ user, contact })
      });
      const data = await res.json();
      if (data['flash']) {
        window.pybossaNotify(data['flash'], true, data['status']);
      }

      return data['found'];
    },

    async getData () {
      try {
        this.waiting = true;
        const res = await fetch(this.getURL(), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.initialize(data);
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      } finally {
        this.waiting = false;
      }
    },

    addCoowner (event, ur) {
      Vue.set(this.coowners, ur.id, ur);
      this.coowners[ur.id] = ur;
    },

    removeCoowner (event, id) {
      Vue.delete(this.coowners, id);
    },

    addContact (event, ur) {
      Vue.set(this.contacts, ur.id, ur);
      this.contacts[ur.id] = ur;
    },

    removeContact (event, id) {
      Vue.delete(this.contacts, id);
    },

    async searchCoowners () {
      try {
        this.coownerResult = await this.search(this.coownerQuery);
      } catch (error) {
        window.pybossaNotify('An error occurred while searching for co-owners: ' + error, true, 'error');
      }
    },

    async searchContacts () {
      try {
        this.contactResult = /*(*/await this.search(this.contactQuery, true);//).filter(contact => contact.is_contact);
        /*if (!this.contactResult || !this.contactResult.length) {
          window.pybossaNotify(`We didn't find any enabled user matching your query: ${this.contactQuery}`, true, 'warning');
        }*/
      } catch (error) {
        window.pybossaNotify('An error occurred while searching for contacts: ' + error, true, 'error');
      }
    },

    async save () {
      const coowners = Object.keys(this.coowners);
      const contacts = Object.keys(this.contacts);
      try {
        this.waiting = true;
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            coowners,
            contacts
          })
        });
        if (res.ok) {
          this.searchResult = [];
          const data = await res.json();
          window.pybossaNotify(data['flash'], true, data['status']);
        } else {
          window.pybossaNotify('An error occurred configuring ownership config.', true, 'error');
        }
      } catch (error) {
        window.pybossaNotify('An error occurred configuring ownership config.', true, 'error');
      } finally {
        this.waiting = false;
      }
    }
  }
};

</script>
<style scoped>
.label {
  font-size: 100%;
  margin-right: 10px
}
.fa-times {
  margin-left:3px;
  color:silver
}
.fa-times:hover {
  color: red
}
.form-control.input-sm {
    width: 280px;
}
</style>
