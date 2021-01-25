<template>
  <p
    style="cursor:default"
    title="Since 12AM in your browser's timezone."
  >
    <strong><i class="fa fa-list-ol" /> Tasks Completed Today:</strong>
    <span v-if="count !== -1 && !error">{{ count }}</span>
    <span v-if="count === -1 && !error">Loading...</span>
    <span v-if="error">There was an error fetching the data.  Please try again.</span>
  </p>
</template>
<script>
export default {
  props: {
    username: String
  },

  data () {
    return {
      count: -1,
      error: null
    };
  },

  computed: {
    startTimeQueryParam () {
      return encodeURIComponent(new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
    },
    urlPath () {
      return `/account/${this.username}/recent_tasks?start=${this.startTimeQueryParam}`;
    }
  },

  created () {
    this.fetchRecentlyCompletedTasks();
  },

  methods: {
    async fetchRecentlyCompletedTasks () {
      try {
        const res = await fetch(this.urlPath, {
          method: 'GET',
          headers: { },
          credentials: 'same-origin'
        });

        if (res.ok) {
          const data = await res.json();

          if (data.hasOwnProperty('count')) {
              this.count = data.count;
          } else {
              this.error = true;
          }
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
    }
  }
};
</script>
