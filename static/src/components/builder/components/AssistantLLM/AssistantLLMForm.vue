<template>
  <div class="row">
    <h3>Assistant LLM Settings</h3>
    <div class="danger-validation-text">
      <label>Please submit SDSK ADD 38813 for production use of LLMs</label>
    </div>
    <div class="form-row">
      <input
        id="add-label"
        :checked="labelAdded"
        type="checkbox"
        @input="updateLabelAdded($event.target.checked)"
      >
      <label for="add-label">
        Add Label
      </label>
      <input
        v-if="labelAdded"
        id="component-label"
        :value="label"
        class="form-control form-control-sm"
        type="text"
        @input="updateLabel($event.target.value)"
      >
    </div>
    <div class="form-row">
      <div>
        <label class="block-label">
          {{ promptSourceLabel }} | <span class="label-tip">{{ promptSourceLabelTip }}</span>
          <input
            :value="prompt[promptSourceType]"
            type="text"
            class="form-control form-control-sm"
            @input="updatePrompt($event.target.value)"
          >
        </label>
      </div>
      <div>
        <label class="col-labels right-padding-radio">
          <input
            v-model="promptSourceType"
            value="variable"
            type="radio"
          >
          From Variable
        </label>
        <label class="col-labels">
          <input
            v-model="promptSourceType"
            value="static"
            type="radio"
          >
          Static
        </label>
      </div>
      <div
        v-if="promptSourceType === 'variable'"
        class="form-group"
      >
        <input
          id="useStaticPromptPreview"
          style="vertical-align:top"
          type="checkbox"
          @input="updateUseStaticPromptPreview($event.target.checked)"
        >
        <label
          class="col-labels"
          for="useStaticPromptPreview"
        >
          Use static in preview.
        </label>
        <br>
        <label
          for="useStaticPromptPreview"
          class="label-tip"
        >
          Check this if you want to configure some sample data under the static option for preview purposes while using a
          variable in your code.
        </label>
      </div>
    </div>
    <br>
    <div id="content-input">
      <div>
        <label class="block-label">
          Content Variable | <span class="label-tip">A JavaScript expression that returns the LLM content. For example, task.info.content.</span>
          <input
            :value="content"
            type="text"
            class="form-control form-control-sm"
            @input="updateContent($event.target.value)"
          >
        </label>
      </div>
    </div>
    <div id="content-preview-input">
      <div>
        <label class="block-label">
          Content Preview | <span class="label-tip">Enter text if you want to configure some sample data for content in the component preview.</span>
          <input
            :value="contentPreview"
            type="text"
            class="form-control form-control-sm"
            @input="updateContentPreview($event.target.value)"
          >
        </label>
      </div>
    </div>

    <h4>Model Settings</h4>
    <div class="form-row">
      <label class="col-labels">
        Model | <span class="label-tip">The LLM model to use.</span>
      </label>
      <select
        class="form-control form-control-sm"
        :value="model"
        @input="updateModel($event.target.value)"
      >
        <option
          v-for="(v, k) in modelOptions"
          :key="k"
          :value="v"
        >
          {{ k }}
        </option>
      </select>
    </div>
    <div class="form-row">
      <label class="col-labels">
        Model Parameters | <span class="label-tip">Leave blank to use default value.</span>
      </label>
      <textarea
        style="min-height: 16em;"
        class="form-control form-control-sm"
        :value="modelParams"
        :placeholder="model_params_placeholder"
        @input="updateModelParams($event.target.value)"
      />
    </div>
    <div class="form-row">
      <label class="col-labels">
        Editable | <span class="label-tip">LLM fields that are editable by the worker.</span>
      </label>
      <select
        class="form-control form-control-sm"
        :value="editable"
        @input="updateEditable($event.target.value)"
      >
        <option
          v-for="(v, k) in EditableOptions"
          :key="k"
          :value="v"
        >
          {{ k }}
        </option>
      </select>
    </div>
    <br>
    <div class="form-row">
      <label
        for="pyb-answer"
        class="col-labels"
      >
        Answer field name | <span class="label-tip">The field where the worker's answer is stored. Can be a JSON path like
          a.b.c.</span>
      </label>
      <input
        id="pyb-answer"
        :value="pybAnswer"
        class="form-control form-control-sm"
        @input="updatePybAnswer($event.target.value)"
      >
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import '../../../../../css/component_builder.css';
import * as types from '../../store/types';
export default {
  name: 'AssistantLLMForm',
  data () {
    return {
      model_params_placeholder:
        `{
          "max_tokens": 16,
          "temperature": 1.0,
          "top_p": 0.9,
          "seed": null,
          "frequency_penalty": 0.0
    }`,
      modelOptions: { 'MISTRAL-NEMO-INSTRUCT': 'mistral-nemo-instruct' },
      EditableOptions: {
        'Response': 'response',
        'Prompt': 'prompt',
        'Both': 'both',
        'None': 'none'
      }
    };
  },
  computed: {
    promptSourceLabel () {
      return `Prompt ${this.promptSourceType === 'variable' ? 'Variable' : ''}`;
    },
    promptSourceLabelTip () {
      return (this.promptSourceType === 'variable') ? 'A JavaScript expression that returns the LLM prompt. For example, task.info.prompt.' : 'The static LLM prompt.';
    },
    promptSourceType: {
      get () {
        return this.$store.state.assistantLLM.promptSourceType;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_ASSISTANT_LLM_PROMPT_SOURCE_TYPE, newValue);
      }
    },
    ...mapState({
      label: state => state.assistantLLM.label,
      labelAdded: state => state.assistantLLM.labelAdded,
      prompt: state => state.assistantLLM.prompt,
      content: state => state.assistantLLM.content,
      contentPreview: state => state.assistantLLM.contentPreview,
      model: state => state.assistantLLM.model,
      modelParams: state => state.assistantLLM.modelParams,
      editable: state => state.assistantLLM.editable,
      pybAnswer: state => state.assistantLLM.pybAnswer,
      useStaticPromptPreview: state => state.assistantLLM.useStaticPromptPreview
    })
  },
  methods: {
    ...mapMutations({
      'updateLabel': types.MUTATE_ASSISTANT_LLM_LABEL,
      'updateLabelAdded': types.MUTATE_ASSISTANT_LLM_LABEL_ADDED,
      'updatePrompt': types.MUTATE_ASSISTANT_LLM_PROMPT,
      'updateContent': types.MUTATE_ASSISTANT_LLM_CONTENT,
      'updateContentPreview': types.MUTATE_ASSISTANT_LLM_CONTENT_PREVIEW,
      'updateModel': types.MUTATE_ASSISTANT_LLM_MODEL,
      'updateModelParams': types.MUTATE_ASSISTANT_LLM_MODEL_PARAMETERS,
      'updateEditable': types.MUTATE_ASSISTANT_LLM_EDITABLE,
      'updatePybAnswer': types.MUTATE_ASSISTANT_LLM_PYB_ANSWER,
      'updateUseStaticPromptPreview': types.MUTATE_ASSISTANT_LLM_USE_STATIC_PROMPT_PREVIEW
    })
  }
};
</script>
