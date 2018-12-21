<template>
<VuePerfectScrollbar class="scroll-area" v-once :settings="settings" >
  <div class="row">
      <div class="col-md-12">
          <component-builder-form></component-builder-form>
      </div>
    </div>
</VuePerfectScrollbar>

</template>
<style >
.scroll-area {
  position: relative;
  margin: auto;
  min-height: 800px;
}
.ps__scrollbar-x-rail{
  display: none !important 

}
</style> 
<script>
import ComponentBuilderForm from './builder/components/ComponentBuilderForm'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'Builder',
  components: {
    ComponentBuilderForm,
    VuePerfectScrollbar
  },
  data() {
    return {
      settings: {
               maxScrollbarLength: 60
      }
    }
  }
   
}
 
</script>
