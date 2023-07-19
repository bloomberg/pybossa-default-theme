<template>
  <div class="row">
    <h4>Task Presenter Settings</h4>
    <div class="form-row">
      <p>Saving partial work functions for all schedulers.</p>
      <input
        id="allow-save-work"
        v-model="allowSaveWork"
        :checked="allowSaveWork"
        type="checkbox"
      >
      <label
        for="allow-save-work"
      >
        &ensp;Allow partial work to be saved
      </label>
    </div>
    <div v-if="allowSaveWork">
      <label
        for="auto-save-seconds"
        style="font-weight: lighter"
      >
        &emsp;&ensp;Seconds between auto saves&emsp;
      </label>
      <input
        id="auto-save-seconds"
        ref="autoSaveSecondsInput"
        v-model.number="autoSaveSeconds"
        class="form-control form-control-sm"
        type="number"
      >
    </div>
    <br>
    <div>
      <p>Assigning workers only functions with Task Queues or User Preference schedulers.</p>
      <input
        id="allow-assign-to-user"
        v-model="allowAssignToUser"
        :checked="allowAssignToUser"
        type="checkbox"
      >
      <label for="allow-assign-to-user">
        &ensp;Allow tasks to be assigned to users
      </label>
    </div>
  </div>
</template>
  <script>
  import * as types from '../../store/types';
  export default {
    name: 'TaskPresenterForm',
    components: { },
      data () {
      return {
        upHere: false,
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
    watch: {
      allowSaveWork: function (newValue) {
        this.autoSaveSeconds = newValue ? 60 : 0;
      }
    },
    updated () {
      if (this.allowSaveWork && this.$refs.autoSaveSecondsInput) {
         this.$refs.autoSaveSecondsInput.focus();
      }
    },
    methods: {
    }
  };
  </script>

<style lang="css" scoped>
#auto-save-seconds {
    width: auto;
    display: inline;
}
</style>
