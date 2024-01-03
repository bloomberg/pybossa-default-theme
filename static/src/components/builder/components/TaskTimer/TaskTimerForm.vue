<template>
  <div class="row">
    <h4>Task Timer Settings</h4>
    <div class="form-row">
      <input
        id="show-lock"
        v-model="showLock"
        :checked="showLock"
        type="checkbox"
      >
      <label for="show-lock">
        Display lock time
      </label>
    </div>
  </div>
</template>

<script>
import '../../../../../css/component_builder.css';
import * as types from '../../store/types';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'TaskTimerForm',
  components: { },
    data () {
    return {
      validationOptions: [],
      inputTypeOptions: {
      }
    };
  },
  computed: {
    showLock: {
      get () {
        return this.$store.state.taskTimer.showLock;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TASK_TIMER_LOCKED, newValue);
      }
    }
  },
  methods: {
  }
};
</script>
