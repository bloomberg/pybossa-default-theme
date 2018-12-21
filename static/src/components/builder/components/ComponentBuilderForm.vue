<template>
    <div class = "row"> 
  <!-- use the modal component, pass in the prop -->
  

    <div class="panel panel-default">
         
        <div class="panel-heading">
           <div class = "row"> 
                <div class="col-md-1">
                    <router-link :to="{ name: 'home'}">
                        <i class="fa fa-angle-double-left" style="font-size:36px"></i>
                    </router-link> 
                </div>
                <div class="col-md-8">
                    <div style="font-size:26px">{{$route.query.questionType.name}} </div>
                </div>
                <div class = "col-md-1 pull-right">
                        <i id="show-modal" @click="showModal = true" class="fa fa-eye" style="color:#3AB0D5; font-size: 26px;"></i>
                </div>
           </div>    
        </div>

        <div class="panel-body" >
                <div class="row"> 
                    <div class="col-md-12">                        
                       <div class= "row">
                            <form >
                                <!-- Component Selector and optional Label for the component  -->
                                <div class="form-row">
                                    <div class="form-group col-md-12">
                                        <!-- <label class= "col-form-label-sm" for="componentSelector" >Select a Component</label>
                                        <select id ="componentSelector" class="form-control form-control-sm"  v-model="selectedComponent" >
                                            <option v-for="e in components"  v-bind:key = "e.id" v-bind:value="e">
                                                {{ e.name }}
                                            </option>
                                        </select> -->
                                        <!-- Add Label checkbox -->
                                        <input type="checkbox" id="add-label" v-on:change ="updateAddLabel" v-model="addLabel">
                                        <label for="add-label">Add Label</label>

                                        <!-- Label input -->
                                        <label v-if = "addLabel === true" class= "col-form-label-sm" for = "label" >Label</label>
                                        <input v-if = "addLabel === true"
                                            id="component-label" 
                                            class="form-control form-control-sm"  
                                            type="text" 
                                            v-model= "form['label'].stringValue" />
                                        <!-- Checkbox for select if label is a variable -->
                                        <input v-if = "addLabel === true" type="checkbox" id="label" v-model="form['for'].isVariable">
                                        <label v-if = "addLabel === true" for="label"> Is Variable Name?</label>
                                    </div>
                                </div>
                                <!-- Generates inputs dinamically depending on the list of props of the selected component-->
                                <div  class="form-row">
                                    <div class="form-group col-md-12" v-for = "prop in selectedComponent.props"  v-bind:key = "prop" >
                                        <label class= "col-form-label-sm" :for = "prop" >{{propsList[prop].name}}</label>
                                    
                                        <!-- Display a dropdown if value  is boolean -->
                                        {{form[prop].booleanValue}}
                                        <select v-if="propsList[prop].formInputType === 'Boolean' 
                                                            && propsList[prop].formInputType === selectedComponent.type
                                                            && (form[prop].isVariable === false || form[prop].isVariable === undefined)"   
                                                    :id ="prop" 
                                                    class="form-control form-control-sm" 
                                                    v-model= "form[prop].booleanValue" >
                                                <option v-for="e in booleanValues"  v-bind:key = "e" v-bind:value="e">
                                                    {{ e }}
                                                </option>
                                        </select>

                                        <!-- Display an input text if value is String 
                                        Use isVariable to determine if values is expression or variable-->
                                        <input  v-else-if = "form[prop].isVariable === true
                                                || propsList[prop].formInputType === 'String' "
                                            :id="prop" 
                                            class="form-control form-control-sm"  
                                            type="text" 
                                            v-model= "form[prop].stringValue" />
                                        <input type="checkbox" :id="prop+'-isVariable'" v-model="form[prop].isVariable">
                                        <label :for="prop+'-isVariable'"> Is Variable Name?</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <!-- Generate snippet and component preview -->
                        <div class= "row">
                            <PreviewComponent v-if="showModal" @close="showModal = false" class="col-md-12" :form = "formToPreview" :addLabel = "addLabel" :selectedComponent = "$route.query.questionType"></PreviewComponent>
                        </div>
                    </div>
                </div>            
            </div> 
        </div>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import PreviewComponent from './PreviewComponent.vue'
import utils from '../utils.js'
import Vue from 'vue'
import modal from './ViewModal.vue'
const components = utils.getComponentsDetails();
const propsList = utils.getComponentsProps();
const booleanValues = ['false','true'];

export default { 
    name: 'ComponentBuilderForm',
    data(){
        return {
            selectedComponent: this.$route.query.questionType,
            propsList,
            components,
            booleanValues,
            form: this.initializeForm(this.$route.query.questionType),
            showModal: false,

            addLabel: false
        }
    },
    components: {
        PreviewComponent,
        VuePerfectScrollbar,
        modal
    },
    computed: {
        formToPreview: function(){
            //This will be replace by a clone deep function 
            //will use lodash later
            return JSON.parse(JSON.stringify(this.form));
        }
        
    },
    watch: {
        selectedComponent: function(newValue, oldValue){
            this.form = this.initializeForm(newValue);
            this.addLabel = false;
        }
    },
    methods: {
        initializeForm: function(selectedComponent){
            let form = {};
            selectedComponent.props.forEach(prop => {
                form[propsList[prop].name]= {
                    stringValue: undefined,
                    booleanValue: undefined,
                    isVariable: false 
                };
            if(selectedComponent.type === 'Boolean' && propsList[prop].formInputType === 'Boolean'  ){
                        form[prop].booleanValue = booleanValues[0];
                }    

        });

        form.label = { stringValue: undefined,
                        booleanValue: undefined,
                        isVariable: false };
        form.for = { isVariable: false};  

        return form;
        },
        updateAddLabel: function(){
            if(!this.addLabel){
                this.form['label'].stringValue = ""
            }
        },
        
    }
}
</script>
