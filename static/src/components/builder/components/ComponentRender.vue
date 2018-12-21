

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import components from '@dtwebservices/pybossa.vue'
const state = {active:false};
const inputBus = new Vue();
Vue.use(Vuex)

const store = new Vuex.Store({
    state
  });

const choices =  ['test1', 'test2' ];
const staticComponentsAttributes = {
	dropdown: { 
		attrs: {
			id: 'static-dropdown',
			choices: ['test1', 'test2' ],
			'pyb-answer': 'staticAnswer',
			'initial-value': 'test2' 
		}
	}
}
const renderFunctions = {
	commonRender: function(createElement){
		return createElement(
			this.selectedComponent,
		  	{
				attrs: this.form
		  	},[]
		);
	},
	dropdownRender: function(createElement ){
		return createElement(
			'dropdown-input',
		  	{
				attrs: staticComponentsAttributes.dropdown.attrs
		  	},[]
		);
	}
}
export default {
    props: ['template', 'form', 'selectedComponent'],
    render: renderFunctions.commonRender,
	components,
	store,
	mounted(){
		// store.commit(mutations.SET_ACTIVE);
	}
}


</script>
