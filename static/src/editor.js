import Vue from 'vue';
import axios from 'axios';
import Builder from './components/builder.vue';
import Imagecrop from './components/image.vue';
import Announcementimagecrop from './components/image_announcement.vue';

const csrfToken = document.querySelector('meta[name="csrf-token"]');
if (csrfToken) {
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken.getAttribute('content');
}

new Vue({ // eslint-disable-line
  el: '#editorpybossa',
  components: {
    Builder,
    Announcementimagecrop,
    Imagecrop
  }
});
