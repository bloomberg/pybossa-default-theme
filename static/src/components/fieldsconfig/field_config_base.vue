<template>
    <div class='field-config'>
        <h4>
        <span :disabled="!editable"
              class="btn btn-sm btn-warning"
              @click="toggleEdit">
            <i v-if="editing" class="fa fa-angle-up" aria-hidden="true"></i>
            <i v-else class="fa fa-pencil-square-o" aria-hidden="true"></i>
        </span>
        <span class="btn btn-sm btn-danger"
              @click="deleteField({ name })">
            <i class="fa fa-trash" aria-hidden="true"></i>
        </span>
        {{type}} Field - {{name}}
        </h4>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
    props: ['name', 'type', 'editable', 'edit'],

    data() {
        return {
            editing: this.edit
        }
    },

    methods: {
        ...mapMutations(['deleteField']),

        toggleEdit() {
            if (!this.editable) {
                return;
            }
            this.editing = !this.editing;
            this.$emit('edit', this.editing);
        }
    }
}
</script>
<style scoped>
.field-config .btn {
    width: 2.5em
}
</style>
