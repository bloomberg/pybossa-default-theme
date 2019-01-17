<template>
  <div class="row">
    <div class="col-md-6">
      <router-link
        :to="textInput"
        tag="a"
        class="list-group-item text-color">
        Text Input
        <i
          class="fa fa-chevron-right pull-right text-color"
          style="color: #3AB0D5;"/>
      </router-link>
      <router-link
        :to="checkboxInput"
        tag="a"
        class="list-group-item text-color">
        Checkbox Input
        <i
          class="fa fa-chevron-right pull-right"
          style="color: #3AB0D5;"/>
      </router-link>
      <router-link
        :to="table"
        tag="a"
        class="list-group-item text-color">
        Table
        <i
          class="fa fa-chevron-right pull-right"
          style="color: #3AB0D5;"/>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Questions',
    data () {
        return {
            checkboxInput: {
                name: 'CHECKBOX_INPUT_FORM',
                params: {
                    componentName: 'CHECKBOX_INPUT',
                    header: 'Checkbox Input' }
            },
            textInput: {
                name: 'TEXT_INPUT_FORM',
                params: {
                    componentName: 'TEXT_INPUT',
                    header: 'Text Input' }
            },
            table: {
                name: 'TABLE_FORM',
                params: {
                    componentName: 'TABLE',
                    header: 'Table' }
            }
        }
    }
}
</script>
