<template>
  <div
    class="stepwizard-step"
    :class="activeClass"
  >
    <a
      role="button"
      :class="stepClass"
      :href="href"
    >
      <i
        :class="iconClass"
        aria-hidden="false"
      />
    </a>
    <div class="stepwizard-label">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step',
  props: {
    done: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    enable: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
      stepClass: function () {
          let classes = 'btn btn-circle btn-lg';
          classes = this.enable ? `${classes} btn-border` : classes;
          classes = this.done ? `${classes} step-done` : classes;
          classes = !this.done && !this.enable ? `${classes} step-disable` : classes;

        return classes;
      },
      iconClass: function () {
          if (this.done) {
            return `${this.icon} icon-white`;
          }
          if (this.enable) {
            return `${this.icon} icon-blue`;
          }
          return `${this.icon} icon-default`;
      },
      activeClass: function () {
        return this.active ? 'active' : '';
      }
  }

};
</script>
