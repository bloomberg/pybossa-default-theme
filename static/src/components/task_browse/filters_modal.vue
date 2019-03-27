<template>
  <browse-modal>
    <template slot="title">
      Applied Filters
    </template>
    <template slot="body">
      <browse-filters />
    </template>
    <template slot="footer">
      <div
        class="btn btn-primary"
        @click="clear"
      >
        Clear Filters
      </div>
      <div
        class="btn btn-default"
        data-dismiss="modal"
      >
        Close
      </div>
    </template>
  </browse-modal>
</template>

<script>
import BrowseModal from './browse_modal';
import BrowseFilters from './browse_filters';
import { mapGetters } from 'vuex';

export default {
  components: {
    BrowseModal,
    BrowseFilters
  },
  data () {
    return {};
  },
  computed: {
    ...mapGetters(['getFilters'])
  },
  methods: {
    clear () {
      window.dispatchEvent(new CustomEvent('clearFilters'));
    }
  }
};
</script>
<style></style>
