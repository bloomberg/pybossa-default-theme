import Vue from 'vue'
import Builder from './components/builder.vue'
import Imagecrop from './components/image.vue'
import Announcementimagecrop from './components/image_announcement.vue'

new Vue({ // eslint-disable-line
    el: '#editorpybossa',
    components: {
        Builder,
        Announcementimagecrop,
        Imagecrop
    }
})
