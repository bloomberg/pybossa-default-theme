<template>
  <div class="row">
    <div
      v-for="(c, i) in checkboxList"
      :key="i"
      class="col-md-12"
    >
      <div class="checkbox">
        <label :for="c.id">
          <checkbox-input
            :id="c.id"
            :initial-value="c['initial-value'].value"
            pyb-answer="c['pyb-answer'].value"
          />
          {{ c.label.value }}
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import components from '@dtwebservices/task-presenter-components';
export default {
  name: 'TableCreator',
  components: { ...components },
  props: {
    checkboxList: {
      type: Array,
      default: function () {
        return [];
      }
    }
  }
};
</script>
