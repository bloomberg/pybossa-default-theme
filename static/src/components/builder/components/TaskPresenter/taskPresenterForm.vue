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
        Allow work to be auto-saved
      </label>
    </div>
    <div v-if="allowSaveWork">
      <label for="auto-save-seconds">
        Seconds between auto saves
      </label>
      <input
        id="auto-save-seconds"
        v-model.number="autoSaveSeconds"
        type="number"
      >
    </div>
    <div>
      <input
        id="allow-assign-to-user"
        v-model="allowAssignToUser"
        :checked="allowAssignToUser"
        type="checkbox"
      >
      <label for="allow-assign-to-user">
        Allow tasks to be assigned to users
      </label>
    </div>
  </div>
</template>
  <script>
  // import '../../../../../css/component_builder.css';
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
    modules: {

    },
    computed: {
      allowSaveWork: {
        get () {
          return this.$store.state.taskPresenter.allowSaveWork;
        },
        set (newValue) {
          this.$store.commit(types.MUTATE_ALLOW_SAVE_WORK, newValue);
        }
      },
      allowAssignToUser: {
        get () {
          return this.$store.state.taskPresenter.allowAssignToUser;
        },
        set (newValue) {
          this.$store.commit(types.MUTATE_ALLOW_ASSIGN_TO_USER, newValue);
        }
      },
      autoSaveSeconds: {
        get () {
          return this.$store.state.taskPresenter.autoSaveSeconds;
        },
        set (newValue) {
          this.$store.commit(types.MUTATE_AUTO_SAVE_SECONDS, newValue);
        }
      }
    },
    methods: {
    }
  };
  </script>

<style lang="css" scoped>
.auto-save-seconds {
    width: 50px;
}
</style>
