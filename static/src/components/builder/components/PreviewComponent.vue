<template>
   <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
                <h3>Preview: {{selectedComponent.name}}</h3>
            </slot>
          </div>

          <div class="modal-body">
                <slot name="body">
                    <div v-if="showPreview" id="snippet" class = "col-md-12 ">
                        <div class = "row">
                            <div class="panel panel-default">
                                <div class="panel-heading">Code Snippet
                                     <i @click="copyTestingCode()" class="fa fa-clipboard pull-right" style="color:#3AB0D5; font-size: 16px;"></i>
                                    <transition name="fade">
                                        <div v-if="copiedMessage">
                                            Snipet copied
                                        </div>
                                    </transition>
                                </div>
                                <div class="panel-body">{{rawHtml}}</div>
                            </div> 
                            <div class="panel panel-default">
                            <div class="panel-heading">Component Preview</div>
                                <div class="panel-body">
                                    <form class="form-horizontal"> 
                                        <label :for="form.id.stringValue">{{form.label.stringValue}}</label>
                                        <ComponentRender :selectedComponent = "selectedComponent.id" :form = "form" :template= "rawHtml"></ComponentRender>
                                                 <input  type="hidden" id="rawHtml-code" :value="rawHtml">

                                    </form> 
                                </div>
                            </div>      
                        </div>
                    </div>  
                </slot>          
          </div>

          <div class="modal-footer">
            <slot name="footer">
                <button class="btn btn-sm btn-primary" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>

  </transition>
</template>

<script>
import Mustache from 'Mustache'
import ComponentRender from './ComponentRender.vue'
const labelTemplate = require( "!!html-loader!./templates/labelTemplate.html");

export default {
    
    name: 'ComponentBuilderForm',
    props: ['selectedComponent', 'form', 'addLabel'],
    data: {
        copiedMessage: false
    },
    computed: { 
        
        rawHtml : function() {
            // this variable will contain all tokens data to be replace on the template
            let formForTemplate ={};
            Object.keys(this.form).forEach(e => { 
                if(this.form[e].booleanValue != undefined){
                    formForTemplate[e] = this.form[e].booleanValue;
                } else {
                    formForTemplate[e] = this.form[e].stringValue;
                }
                
            });

            let output = Mustache.render(this.selectedComponent.template, formForTemplate);     

            //if addlabel is true a label will wrapper the component       
            if(this.addLabel){
                const label = {for: formForTemplate['id'], component: output, label: formForTemplate['label'] }
                output = Mustache.render(labelTemplate, label);  
            }

            //This piece isresponsible of adding : for those props that are variables
            Object.keys(this.form).forEach(e => { 
                if(this.form[e].isVariable){
                    output = output.replace(e + '=',':'+ e + '=');
                }
            });

            return output;
        },

        showPreview : function(){
            let showPreview = true;
            //if all props are filled then the component will be show
            //we can add better valdation to display on other cases
            Object.keys(this.form).forEach(e => { 
                if((this.form[e].booleanValue === undefined && this.form[e].stringValue === undefined 
                        && e !== 'label' && e !== 'for')
                    || (this.addLabel && !this.form[e].stringValue && e === 'label')){
                    showPreview = false;
                } 
            });
            
            return showPreview;             
        }
    },
    methods: {
        copyTestingCode () {
          this.copiedMessage = true;

          let testingCodeToCopy = document.querySelector('#rawHtml-code')
          testingCodeToCopy.setAttribute('type', 'text')    
          testingCodeToCopy.select()
          var successful = document.execCommand('copy');
          var msg = successful ? 'successful' : 'unsuccessful';

          /* unselect the range */
          testingCodeToCopy.setAttribute('type', 'hidden')
          window.getSelection().removeAllRanges()
          var root = this;
          setTimeout( () => {
              this.copiedMessage = false;
            }, 3000);
        },
    },
    components: {
        ComponentRender
    }
    }
</script>


<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 700px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
