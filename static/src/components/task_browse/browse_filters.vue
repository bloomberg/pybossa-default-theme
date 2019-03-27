<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Filter</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(filter, key) in filters" :key="key">
          <td class="col-xs-4">{{ filter.disp }}</td>
          <td class="col-xs-4">{{ filter.val }}</td>
        </tr>
      </tbody>
    </table>
    <task-info-filters></task-info-filters>
    <user-info-filters></user-info-filters>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TaskInfoFilters from "./task_info_filters";
import UserInfoFilters from "./user_info_filters";

const formatters = {
  def: val => val,
  bool: val => (val ? "True" : "False")
};

export default {
  data() {
    return {
      allFilters: {
        task_id: { disp: "Task Id" },
        priority_from: { disp: "Priority From" },
        priority_to: { disp: "Priority To" },
        created_from: { disp: "Created Time From" },
        created_to: { disp: "Created Time To" },
        pcomplete_from: { disp: "% Completed From" },
        pcomplete_to: { disp: "% Completed To" },
        ftime_from: { disp: "Finish Time From" },
        ftime_to: { disp: "Finish Time To" },
        gold_task: { disp: "Gold Task", type: "bool" }
      }
    };
  },

  computed: {
    ...mapGetters(["getFilters"]),

    filters() {
      const rv = {};
      for (const k of Object.keys(this.allFilters)) {
        const { disp, type = "def" } = this.allFilters[k];
        if (this.getFilters[k] !== undefined) {
          rv[k] = {
            disp,
            val: formatters[type](this.getFilters[k])
          };
        }
      }
      return rv;
    }
  },

  components: { TaskInfoFilters, UserInfoFilters }
};
</script>
<style></style>
