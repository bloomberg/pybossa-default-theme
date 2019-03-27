<template>
  <div>
    <div v-if="languages.length">
      <h4>Language Filters</h4>
      <p class="pill-list">
        <span
          v-for="(language, index) in languages"
          :key="index"
          class="label label-info label-md"
        >
          {{ language }}
        </span>
      </p>
    </div>

    <div v-if="locations.length">
      <h4>Location Filters</h4>
      <p class="pill-list">
        <span
          v-for="(location, index) in locations"
          :key="index"
          class="label label-info label-md"
        >
          {{ location }}
        </span>
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getFilters']),

    locations () {
      return ((this.getFilters.filter_by_upref || {}).locations || []);
    },

    languages () {
      return ((this.getFilters.filter_by_upref || {}).languages || []);
    }
  }
};
</script>
<style>
.pill-list {
    display: flex;
    flex-wrap: wrap;
}

.pill-list span {
    margin-right: .2em;
    margin-bottom: .2em;
}
</style>
