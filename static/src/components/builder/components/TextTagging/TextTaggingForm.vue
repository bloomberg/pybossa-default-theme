<template>
  <div
    class="row"
    style="margin-top:15px"
  >
    <div class="form-group">
      <input
        id="add-label"
        v-model="labelAdded"
        type="checkbox"
      >
      <label for="add-label">
        Add Label
      </label>
      <input
        v-if="labelAdded === true"
        id="component-label"
        v-model="label"
        class="form-control form-control-sm"
        type="text"
      >
    </div>
    <div class="form-group">
      <label
        for="pyb-answer"
      >
        Answer field name | <span class="label-tip">The field where the worker's answer is stored. Can be JSON path like a.b.c.</span>
      </label>
      <input
        id="pyb-answer"
        v-model="pybAnswer"
        class="form-control form-control-sm"
        type="text"
      >
    </div>
    <div class="form-group">
      <label
        for="editMode"
      >
        Edit mode
      </label>
      <select
        id="editMode"
        v-model="editMode"
        class="form-control"
        :class="{'danger-validation':getErrors(`readOnly`)}"
      >
        <option
          selected
          value="readWrite"
        >
          Add new tags and edit/remove existing tags
        </option>
        <option value="readOnly">
          Only view existing tags
        </option>
      </select>
      <div class="danger-validation-text">
        {{ getErrors(`readOnly`) }}
      </div>
    </div>
    <hr>
    <h4>
      Tags
    </h4>
    <div
      id="tags"
      class="scroll"
    >
      <div
        v-for="(tag, index) in tagList"
        :key="index"
      >
        <hr
          v-if="index != 0"
          size="100px"
        >
        <label>Tag {{ index + 1 }}</label>
        <button
          v-if="tagList.length > 1"
          class="btn btn-times-delete pull-right fa fa-times"
          :title="`Delete Tag ${index + 1}`"
          @click="deleteTag(index)"
        /><br>
        <label
          class="block-label"
        >
          Name | <span class="label-tip">The tag name to store in the answer.</span>
          <select
            v-model="tag.name"
            class="form-control form-control-sm"
            :class="{'danger-validation':getErrors(`tagList[${index}].name`)}"
          >
            <option>ORG</option>
            <option>PER</option>
            <option>CUR</option>
          </select>
        </label>
        <div class="danger-validation-text">
          {{ getErrors(`tagList[${index}].name`) }}
        </div>
        <label
          class="block-label"
        >
          Display | <span class="label-tip">The tag name to display in the selection menu.</span>
          <input
            v-model="tag.display"
            class="form-control form-control-sm"
            :class="{'danger-validation':getErrors(`tagList[${index}].display`)}"
            type="text"
          >
        </label>
        <div class="danger-validation-text">
          {{ getErrors(`tagList[${index}].display`) }}
        </div>
        <label
          class="block-label"
        >
          Color | <span class="label-tip">The background color for the tag.</span>
          <input
            v-model="tag.color"
            class="form-control form-control-sm"
            :class="{'danger-validation':getErrors(`tagList[${index}].color`)}"
            type="color"
          >
        </label>
        <div class="danger-validation-text">
          {{ getErrors(`tagList[${index}].color`) }}
        </div>
      </div>
      <br>
    </div>
    <button
      id="add"
      class="btn btn-default btn-sm col-sm-2"
      @click="addTag"
    >
      Add Another Tag
    </button>
    <br>
    <div class="form-group">
      <hr>
      <h4>Confidence Threshold</h4>
      <input
        v-model="confidenceThreshold"
        class="form-control form-control-sm"
        type="number"
        min="0"
        max="1"
        step="0.01"
      >
      <div class="danger-validation-text">
        {{ getErrors(`confidenceThreshold`) }}
      </div>
    </div>
    <div>
      <hr>
      <h4>
        Text &amp; Entities
      </h4>
      <div>
        <label
          class="col-labels right-padding-radio"
        >
          <input
            v-model="sourceType"
            value="variable"
            type="radio"
          >
          From Variable
        </label>
        <label
          class="col-labels"
        >
          <input
            v-model="sourceType"
            value="static"
            type="radio"
          >
          Static
        </label>
      </div>
      <div
        v-if="sourceType==='variable'"
        class="form-group"
      >
        <input
          id="useStatic"
          v-model="useStaticInPreview"
          style="vertical-align:top"
          type="checkbox"
        >
        <label
          class="col-labels"
          for="useStatic"
        >
          Use static in preview.
        </label>
        <br>
        <label
          for="useStatic"
          class="label-tip"
        >
          Check this if you want to configure some sample data under the static option for preview purposes while using a variable in your code.
        </label>
        <div class="danger-validation-text">
          {{ getErrors(`useStaticInPreview`) }}
        </div>
      </div>
    </div>
    <div>
      <label
        class="block-label"
      >
        {{ textSourceLabel }} | <span class="label-tip">{{ textSourceLabelTip }}</span>
        <input
          id="textSource"
          v-model="textSource"
          type="text"
          class="form-control form-control-sm"
          :class="{'danger-validation':getErrors(`text.${sourceType}`)}"
        >
      </label>
      <div class="danger-validation-text">
        {{ getErrors(`text.${sourceType}`) }}
      </div>
    </div>
    <template v-if="sourceType==='variable'">
      <label
        class="block-label"
      >
        Entities Variable | <span class="label-tip">A JavaScript expression that returns the entities. For example, task.info.entities.</span>
        <input
          v-model="entitySource"
          type="text"
          class="form-control form-control-sm"
          :class="{'danger-validation':getErrors(`entities.variable`)}"
        >
      </label>
      <div class="danger-validation-text">
        {{ getErrors(`entities.variable`) }}
      </div>
    </template>
    <template v-else-if="sourceType==='static'">
      <label
        class="col-labels"
        :class="{'danger-validation-text':getErrors(`entities.static`)}"
      >
        {{ entityList.length ? "Entities" : "No Entities" }}
      </label>
      <div class="danger-validation-text">
        {{ getErrors(`entities.static`) }}
      </div>
      <div
        id="entities"
        class="scroll"
      >
        <div
          v-for="(entity, index) in entityList"
          :key="index"
        >
          <hr
            v-if="index != 0"
            size="100px"
          >
          <label>Entity {{ index + 1 }}</label>
          <button
            class="btn btn-times-delete pull-right fa fa-times"
            :title="`Delete Entity ${index + 1}`"
            @click="deleteEntity(index)"
          /><br>
          <label
            class="block-label"
          >
            Head Offset | <span class="label-tip">The character position where the entity starts. Count starts with 0.</span>
            <input
              v-model.number="entity.headoffset"
              class="form-control form-control-sm"
              :class="{'danger-validation':getErrors(`entities.static[${index}].headoffset`)}"
              type="text"
            >
          </label>
          <div class="danger-validation-text">
            {{ getErrors(`entities.static[${index}].headoffset`) }}
          </div>
          <label
            class="block-label"
          >
            Tail Offset | <span class="label-tip">The character position AFTER the entity ends. Count starts with 0.</span>
            <input
              v-model.number="entity.tailoffset"
              class="form-control form-control-sm"
              :class="{'danger-validation':getErrors(`entities.static[${index}].tailoffset`)}"
              type="text"
            >
          </label>
          <div class="danger-validation-text">
            {{ getErrors(`entities.static[${index}].tailoffset`) }}
          </div>
          <label
            class="block-label"
          >
            Tag Name | <span class="label-tip">The tag to apply to the entity. Must be one of the configured tags.</span>
            <select
              v-model="entity.taggedtype"
              :class="{'danger-validation':getErrors(`entities.static[${index}].taggedtype`)}"
              class="form-control form-control-sm"
            >
              <option
                v-for="tagName in tagNames"
                :key="tagName"
                :value="tagName"
              >
                {{ tagName }}
              </option>
            </select>
          </label>
          <div class="danger-validation-text">
            {{ getErrors(`entities.static[${index}].taggedtype`) }}
          </div>
        </div>
        <br>
      </div>
      <button
        id="addEntity"
        class="btn btn-default btn-sm col-sm-2 col-md-2"
        @click="addEntity"
      >
        Add {{ entityList.length ? 'Another ' : '' }}Entity
      </button>
    </template>
  </div>
</template>
<script>
import '../../../../../css/component_builder.css';
import { mapMutations, mapState } from 'vuex';
import * as types from '../../store/types';
import { chain } from 'lodash';

function scrollToEnd (selector) {
  const container = document.querySelector(selector);
  if (container) {
    const scrollHeight = container.scrollHeight;
    container.scrollTop = scrollHeight;
  }
}

export default {
  name: 'TextTaggingForm',
  components: {},
  data () {
    return {
      scrollToEndSelectors: []
    };
  },
  computed: {
    textSourceLabel () {
      return `Text ${this.sourceType === 'variable' ? 'Variable' : ''}`;
    },
    textSourceLabelTip () {
      return (this.sourceType === 'variable') ? 'A JavaScript expression that returns the text to display. For example, task.info.text.' : 'The static text to display.';
    },
    useStaticInPreview: {
      get () {
        return this.$store.state.textTagging.useStaticInPreview;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_USE_STATIC_IN_PREVIEW, newValue);
      }
    },
    tagNames: {
      get () {
        return chain(this.tagList).map('name').filter().uniq().value();
      }
    },
    entitySource: {
      get () {
        return this.$store.state.textTagging.entities.variable;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_ENTITY_SOURCE, newValue);
      }
    },
    sourceType: {
      get () {
        return this.$store.state.textTagging.sourceType;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_SOURCE_TYPE, newValue);
      }
    },
    textSource: {
      get () {
        return this.$store.state.textTagging.text[this.sourceType];
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_TEXT, newValue);
      }
    },
    editMode: {
      get () {
        return this.$store.state.textTagging.readOnly ? 'readOnly' : 'readWrite';
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_READONLY, newValue === 'readOnly');
      }
    },
    confidenceThreshold: {
      get () {
        return this.$store.state.textTagging.confidenceThreshold;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_CONFIDENCE_THRESHOLD, newValue);
      }
    },
    pybAnswer: {
      get () {
        return this.$store.state.textTagging.pybAnswer;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_ANSWER_FIELD, newValue);
      }
    },
    labelAdded: {
      get () {
        return this.$store.state.textTagging.labelAdded;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_LABEL_ADDED, newValue);
      }
    },
    label: {
      get () {
        return this.$store.state.textTagging.label;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_LABEL, newValue);
      }
    },
    ...mapState({
      tagList: state => state.textTagging.tagList,
      entityList: state => state.textTagging.entities.static
    })
  },
  updated () {
    this.scrollToEndSelectors.forEach(scrollToEnd);
    this.scrollToEndSelectors = [];
  },
  methods: {
    ...mapMutations({
      'deleteTag': types.MUTATE_TEXT_TAGGING_DELETE_TAG,
      'deleteEntity': types.MUTATE_TEXT_TAGGING_DELETE_ENTITY
    }),
    getErrors (key) {
      return (this.$store.getters[types.GET_TEXT_TAGGING_ERRORS][key] || []).join('\n');
    },
    addTag () {
      this.$store.commit(types.MUTATE_TEXT_TAGGING_ADD_TAG);
      this.scrollToEndSelectors.push('#tags');
    },
    addEntity () {
      this.$store.commit(types.MUTATE_TEXT_TAGGING_ADD_ENTITY);
      this.scrollToEndSelectors.push('#entities');
    }
  }
};
</script>
