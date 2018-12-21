<template>
 <div class="panel panel-default">
         
        <div class="panel-heading">
           <div class = "row"> 
                <div class="col-md-6">
                   Questions
                </div>
           </div>    
        </div>
 
         <div class="panel-body" >
                <div class="row"> 
                    <div class="col-md-12">       
                        <div v-for="e in components" v-bind:key = "e.id" v-bind:value="e"> 
                                <router-link :to="{ name: 'questionbuilder', query: { questionType: e} }">
                                        {{ e.name }}
                                </router-link>     
                        </div>
                    </div>  
                </div>   
        </div>               
    </div>  

</template>mrivera

<script>

import utils from './builder/utils.js'
const components = utils.getComponentsDetails();
console.log(components)
export default {
  name: 'Questions',
  data() {
    return {
        components
      
    }
  }
   
}


</script>