<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-12">
        <GigSpinner v-if="waiting" />
        <div>
          <label class="typo__label">Assign users</label>
          <multiselect
            v-model="addUserValues"
            placeholder="Search"
            label="fullname"
            track-by="email"
            :options="allUserList"
            :multiple="true"
          />
        </div>
        <br>
        <div>
          <label class="typo__label">Remove users</label>
          <multiselect
            v-model="removeUserValues"
            placeholder="Search"
            label="fullname"
            track-by="email"
            :options="assignedUserList"
            :multiple="true"
          />
        </div>
      </div>
    </div>
    <p></p>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import { mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';
import GigSpinner from '../common/gig_spinner.vue';

export default {
  components: {
    Multiselect,
    GigSpinner
  },

  data () {
    return {
      waiting: false,
      allUserList: [],
      assignedUserList: [],
      addUserValues: [],
      removeUserValues: []
    };
  },

  methods: {
    ...mapGetters([
      'getSelectedTask',
      'getFilters',
      'getCsrfToken'
    ]),

    initialize (data) {
      this.allUserList = data.all_users || [];
      this.assignedUserList = data.assign_users || [];
    },

    getURL () {
      let path = window.location.pathname;
      let res = path.split('/');
      if (res[res.length - 1] !== 'browse') {
        res = res.splice(0, res.length - 2);
      }
      res[res.length - 1] = 'assign-workersupdate';
      return res.join('/');
    },

    async getData () {
      let requestData = {
        taskId: this.getSelectedTask(),
        filters: JSON.stringify(this.getFilters())
      };
      try {
        this.waiting = true;
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.getCsrfToken()
          },
          credentials: 'same-origin',
          body: JSON.stringify(requestData)
        });
        const data = await res.json();
        this.initialize(data);
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      } finally {
        this.waiting = false;
      }
    },

    async save () {
      let requestData = {
        taskId: this.getSelectedTask(),
        filters: JSON.stringify(this.getFilters()),
        add: this.addUserValues,
        remove: this.removeUserValues
      };
      try {
        this.waiting = true;
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.getCsrfToken()
          },
          credentials: 'same-origin',
          body: JSON.stringify(requestData)
        });
        console.log(res);
        } catch (error) {
          window.pybossaNotify('An error occurred.', true, 'error');
        } finally {
          this.waiting = false;
          window.location.reload();
        }
    }
  }
};

</script>
