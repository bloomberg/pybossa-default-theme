<template>
  <div class="row">
    <h4>Task Presenter Settings</h4>
    <div class="form-row">
      <input
        id="allow-save-work"
        v-model="allowSaveWork"
        :checked="allowSaveWork"
        type="checkbox"
      >
      <label for="allow-save-work">
        Allow work to be saved
      </label>
    </div>
</div>
</template>
  <script>
  import '../../../../../css/component_builder.css';
  import * as types from '../../store/types';
  import { mapMutations, mapState } from 'vuex';
  export default {
    name: 'TaskPresenterForm',
    components: { },
      data () {
      return {
        validationOptions: [],
        inputTypeOptions: {
        }
      };
    },
    computed: {
      allowSaveWork: {
        get () {
          return this.$store.state.taskPresenter.allowSaveWork;
        },
        set (newValue) {
          this.$store.commit(types.MUTATE_ALLOW_SAVE_WORK, newValue);
        }
      }
    },
    methods: {
    }
  };
  </script>
