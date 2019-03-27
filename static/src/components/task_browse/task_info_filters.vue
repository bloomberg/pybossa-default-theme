<template>
  <div v-if="filters.length">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Task Info Filters</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(el, index) in filters"
          :key="index"
        >
          <td>{{ el }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getFilters']),

    filters () {
      return (this.getFilters.filter_by_field || [])
        .map((filter) => filter.join(' '));
    }
  }
};
</script>
<style>
</style>
