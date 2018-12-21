<template>
  <ul class="nav nav-pills tab-pills" >
    <router-link
      :to="toForm"
      tag="li"
      active-class="active"
      exact><a>Form</a></router-link>
    <router-link
      :to="toView"
      tag="li"
      active-class="active"><a>Preview</a></router-link>
    <li
      v-if="$route.name.includes('FORM')"
      class="pull-right">
      <div>
        <button
          id="trash"
          class="btn btn-link fa fa-trash"
          style="text-decoration: none"
          @click="clearForm"/>
      </div>
    </li>
    <li
      v-else
      class="pull-right">
      <button
        v-clipboard:copy="snippet"
        v-clipboard:success="onCopied"
        id="copy"
        class="btn btn-link fa fa-clipboard"
        style="text-decoration: none"/>
      <div class="pull-left pad">   {{ copyMessage }}    </div>
    </li>
  </ul>
</template>
<style>

.nav-pills.tab-pills>li>a {
    border-bottom-right-radius: 0px
}

.nav-pills.tab-pills>li:not(:first-of-type)>a {
    border-bottom-left-radius: 0px
}

.nav-pills.tab-pills>li.active>a, .nav-pills>li.active>a:hover, .nav-pills>li.active>a:focus {
    color: #fff;
    background-color: #4aa7df;
    border: none
 }

 button#copy:hover {
    background-color: #F5F7F7;
    border-radius: 4px;
    padding: 11px 15px;
}
.pad {
       padding: 11px 15px;
       color:  #4aa7df
}

button#copy:hover {
    background-color: #F5F7F7;
    border-radius: 4px;
    padding: 11px 15px;
}

</style>
<script>
import * as types from '../store/types'
import utils from '../utils'
export default {
    name: 'TabSubHeader',
    props: {
        toForm: {
            required: true,
            type: Object,
            default: null },
        toView: {
            required: true,
            type: Object,
            default: null }
    },
    data () {
        return {
            copyMessage: ''
        }
    },
    computed: {
        snippet: function () {
            const getFormType = types['GET_' + this.$route.params.componentName + '_FORM']
            const form = this.$store.getters[getFormType]
            return utils.getComponentCode(form, this.$route.params.componentName)
        }
    },
    methods: {
        clearForm: function () {
            this.$store.dispatch(
                types['CLEAR_' + this.$route.params.componentName + '_FORM'])
        },
        onCopied () {
            this.copyMessage = 'Copied'
            setTimeout(() => {
                this.copyMessage = ''
            }, 1000)
        }
    }
}
</script>
