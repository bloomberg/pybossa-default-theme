<template>
  <div class="row">
    <h4>Annotation Copilot Settings</h4>
    <div class="form-group">
      <label
        class="col-labels"
        for="pyb-answer"
      >
        Answer field name | <span class="label-tip">The field where the worker's answer is stored. Can be JSON path like a.b.c.</span>
      </label>
      <input
        id="pyb-answer"
        :value="pybAnswer"
        class="form-control form-control-sm"
        type="text"
        @input="updatePybanswer($event.target.value)"
      >
    </div>
    <div class="form-group">
      <label
        class="col-labels"
        for="doc-url"
      >
        Document URL field name | <span class="label-tip">A JavaScript expression that returns the document URL, e.g.'task.info.document__upload_file'.</span>
      </label>
      <input
        id="doc-url"
        :value="docUrl"
        class="form-control form-control-sm"
        type="text"
        @input="updateDocUrl($event.target.value)"
      >
    </div>
    <div class="form-group">
      <label
        class="col-labels"
        for="annotation-url"
      >
        Annotation URL field name | <span class="label-tip">A JavaScript expression that returns the annotation URL, e.g.'task.info.annotation'.</span>
      </label>
      <input
        id="annotation-url"
        :value="annotationUrl"
        class="form-control form-control-sm"
        type="text"
        @input="updateAnnotationUrl($event.target.value)"
      >
    </div>
    <hr>
    <h4>
      Categories
    </h4>
    <div class="scroll col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div
            v-for="(category, index) in categoryList"
            :key="index"
            class="row"
            name="columns"
          >
            <hr
              v-if="index != 0"
              size="100px"
            >
            <label>Category {{ index + 1 }}</label>
            <button
              v-if="index > 0"
              class="btn btn-times-delete pull-right fa fa-times"
              @click="deleteCategoryListItem(index)"
            /><br>
            <label
              class="block-label"
            >
              Category Label | <span class="label-tip">Text to display for the category.</span>
              <input
                :value="category.name"
                class="form-control form-control-sm"
                type="text"
                @input="updateCategoryItem(category, index, 'name', $event.target.value)"
              >
            </label>
            <label
              class="block-label"
            >
              Data Type | <span class="label-tip">Data type of the caputured data value.</span>
              <select
                :value="category.type"
                class="form-control form-control-sm"
                @change="updateCategoryItem(category, index, 'type', $event.target.value)"
              >
                <option selected />
                <option
                  v-for="categoryType in categoryTypes"
                  :key="categoryType"
                  :value="categoryType"
                >
                  {{ categoryType }}
                </option>
              </select>
            </label>
            <label
              class="block-label"
            >
              CSS Style | <span class="label-tip">Inline CSS string, e.g. 'color: red;'.</span>
              <input
                id="value"
                class="form-control form-control-sm"
                type="text"
                :value="category.style"
                @input="updateCategoryItem(category, index, 'style', $event.target.value)"
              >
            </label>
          </div>
          <br>
        </div>
      </div>
    </div>
    <div class="col-sm-10 col-md-11" />
    <button
      id="add"
      class="btn btn-default btn-sm col-sm-2 col-md-1"
      @click="addCategoryListItem"
    >
      Add
    </button>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { mapMutations, mapState } from 'vuex';
import '../../../../../css/component_builder.css';
import * as types from '../../store/types';

export default {
  name: 'AncoForm',
  data () {
    return {
      categoryTypes: ['Date', 'Datetime', 'Integer', 'Number', 'Text']
    };
  },
  computed: {
    ...mapState({
      pybAnswer: state => state.anco.pybAnswer,
      categoryList: state => state.anco.categoryList,
      docUrl: state => state.anco.docUrl,
      annotationUrl: state => state.anco.annotationUrl
    })
  },
  updated () {
    this.scrollToEnd();
  },
  methods: {
    ...mapMutations({
      'updatePybanswer': types.MUTATE_ANCO_PYB_ANSWER,
      'addCategoryListItem': types.MUTATE_ANCO_ADD_LIST_ITEM,
      'deleteCategoryListItem': types.MUTATE_ANCO_DELETE_LIST_ITEM,
      'updateDocUrl': types.MUTATE_ANCO_DOC_URL,
      'updateAnnotationUrl': types.MUTATE_ANCO_ANNOTATION_URL
    }),
    updateCategoryItem (category, index, fieldName, value) {
      const newCategory = cloneDeep(category);
      newCategory[fieldName] = value;
      this.$store.commit(types.MUTATE_ANCO_UPDATE_LIST_ITEM, { category: newCategory, index });
      this.scrollToEnd();
    },
    scrollToEnd () {
      const container = document.querySelector('.scroll');
      if (container) {
        const scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight;
      }
    }
  }
};
</script>
