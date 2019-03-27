<template>
  <div
    class="modal-dialog modal-md"
    role="document"
  >
    <div class="modal-content">
      <div class="modal-header">
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">
            &times;
          </span>
        </button>
        <h4
          id="infoModalLabel"
          class="modal-title"
        >
          <slot name="title">
            hello
          </slot>
        </h4>
      </div>
      <div class="modal-body">
        <slot name="body" />
      </div>
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  methods: {
  }
};
</script>
<style>
</style>
