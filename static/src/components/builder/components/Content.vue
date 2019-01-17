<template>
  <div class = "row">
    <div class="col-md-12">
      <div class="panel panel-default">
        <tab-sub-header
          :to-form="toForm"
          :to-view="toView"/>
        <div class="col-md-12">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TabSubHeader from './TabSubHeader.vue'

export default {
    components: { TabSubHeader },
    data () {
        return {
            toForm: this.getRouteInfo('_FORM'),
            toView: this.getRouteInfo('_PREVIEW'),
        }
    },
    methods: {
        getRouteInfo (tab) {
            return {
                name: this.$route.params.componentName + tab,
                params: {
                    componentName: this.$route.params.componentName,
                    header: this.$route.params.header
                }
            }
        }
    }
}
</script>
