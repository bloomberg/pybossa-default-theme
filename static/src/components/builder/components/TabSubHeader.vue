<template>
  <ul class="nav nav-pills tab-pills" >
    <router-link
      v-if="!$route.path.includes('helper')"
      :to="toForm"
      tag="li"
      active-class="active"
      exact>
      <a>Settings</a>
    </router-link>
    <router-link
      :to="toView"
      tag="li"
      active-class="active">
      <a>Preview</a>
    </router-link>
    <router-link
      :to="toCode"
      tag="li"
      active-class="active">
      <a>Code</a>
    </router-link>
    <li
      v-if="$route.path.includes('form')"
      class="pull-right">
      <div>
        <button
          id="clear"
          class="btn btn-link fa fa-eraser"
          style="text-decoration: none"
          @click="clearForm"><span class="copy-font"> Clear Settings</span></button>
      </div>
    </li>
    <li
      v-if="$route.path.includes('code')"
      class="pull-right">
      <button
        v-clipboard:copy="snippet"
        id="copy"
        class="btn btn-link fa fa-clipboard"
        style="text-decoration: none"><span class="copy-font"> Copy Code</span></button>
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

 button#clear:hover {
    background-color: #F5F7F7;
    border-radius: 4px;
    padding: 11px 15px;
}
.copy-font {
    font-family:"Source Sans Pro",sans-serif;
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
            default: null },
        toCode: {
            required: true,
            type: Object,
            default: null }
    },
    computed: {
        form: {
            get () {
                let form = {}
                const getFormType = types[`GET_${this.$route.params.componentName}_FORM`]
                if (getFormType) {
                    form = this.$store.getters[getFormType]
                }
                return form
            }
        },
        snippet: {
            get () {
                return utils.getSnippet(this.$route.params.componentName, this.form)
            }
        }
    },
    methods: {
        clearForm: function () {
            this.$store.dispatch(
                types[`CLEAR_${this.$route.params.componentName}_FORM`])
        }
    }
}
</script>
