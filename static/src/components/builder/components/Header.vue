<template>
  <div class = "row text-color">
    <div
      v-if="$route.name !== 'home'"
      class="col-md-12 icon-pointer">
      <i
        class="fa fa-angle-double-left fa-w-14 fa-1x"
        style="text-decoration: none"
        @click="navigateToHome"/>
      <span>{{ $route.params.header ? $route.params.header : 'Questions' }}</span>
    </div>

    <div
      v-if="$route.name == 'home'"
      class="col-md-12 icon-pointer">
      <i
        class="fa fa-home fa-w-14 fa-1x"
        style="text-decoration: none"
        @click="navigateToHome"/>
      <span>{{ 'Task Presenter Components' }}</span>
    </div>

  </div>
</template>

<style>
.text-color {
    color:#3AB0D5;
}
.icon-pointer {
    cursor: pointer;
    font-size: 2em;
    margin-left: 0.25em;
}
</style>

<script>
import * as types from '../store/types'

export default {
    name: 'Header',
    data () {
        return {
        }
    },
    methods: {
        navigateToHome: function () {
            const getClearType = types['CLEAR_' + this.$route.params.componentName + '_FORM']
            if (getClearType) {
                this.$store.dispatch(getClearType)
            }
            this.$router.push({ name: 'home' })
        }
    },
    beforeRouteEnter (to, from, next) {
        next()
    }
}
</script>
