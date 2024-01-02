<template>
  <div class="row text-color">
    <div
      v-if="$route.name !== 'home'"
      class="col-md-12 bread-crumbs"
    >
      <i
        class="fa fa-angle-double-left fa-w-14 fa-1x icon-pointer"
        style="text-decoration: none"
        @click="navigateToHome"
      />
      <span>
        {{ $route.params.header || "Questions" }}
      </span>
    </div>
    <div
      v-else
      class="col-md-12 bread-crumbs"
    >
      <i
        class="fa fa-home fa-w-14 fa-1x"
        style="text-decoration: none"
      />
      <span>{{ "Task Presenter Components" }}</span>
    </div>
  </div>
</template>

<style>
.text-color {
  color: #3ab0d5;
}
.icon-pointer {
  cursor: pointer;
}
.bread-crumbs {
  font-size: 2em;
  margin-left: 0.25em;
}
</style>

<script>
import * as types from '../store/types';

export default {
  name: 'Header',
  beforeRouteEnter (to, from, next) {
    next();
  },
  data () {
    return {};
  },
  methods: {
    navigateToHome () {
      const getClearType =
        types[`MUTATE_CLEAR_${this.$route.params.componentName}_FORM`];
      if (getClearType) {
        this.$store.commit(getClearType);
      }

      this.$router.push({ name: 'home' });
    }
  }
};
</script>
