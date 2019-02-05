<template>
  <div class = "row text-color">
    <div
      v-if="$route.name !== 'home'"
      class="col-md-1 icon-back">
      <i
        class="fa fa-angle-double-left fa-w-14 fa-3x"
        @click="navigateToHome"/>
    </div>
    <h3 class="col-md-11 pull-left">
      {{ $route.params.header ? $route.params.header : 'Questions' }}
    </h3>
  </div>
</template>

<style>
.text-color {
    color:#3AB0D5;
}
.icon-back {
    cursor: pointer;
    color:#3AB0D5;
    font-size: 15px;
    padding-left: 20px;
    padding-top:12px;
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
