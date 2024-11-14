<template>
  <div class="eth-input-wrap">
    <input
      autocomplete="off"
      :value.prop="modelValue"
      :type="inputType"
      :maxlength="maxLength"
      :name="name"
      :placeholder="placeholder"
      class="eth-input"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
      @keyup.enter="emit('handle-enter')"
    />
  </div>
</template>

<script lang="ts" setup>
import { toRefs, useId } from 'vue'

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
  (e: 'handle-enter'): void
}>()
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  inputType: {
    type: String,
    default: 'text',
  },
  maxLength: {
    type: Number,
    default: null,
  },
})
const { placeholder, inputType, maxLength } = toRefs(props)
const uid = useId()

const name = `input${uid}`
</script>

<style lang="postcss">
@import '../../css/global.postcss';

.eth-input-wrap {
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  > input {
    box-sizing: border-box;
    padding-top: 3px;
  }
}

.eth-input {
  @mixin text-medium 15px;
  color: white;
  background: black;
  width: 100%;
  height: 42px;
  outline: none;
  font-size: 14px;
  outline-style: none;
  box-shadow: none;
  border: 1px solid $blue;
  border-radius: 0px;
  padding-left: 16px;
  padding-right: 16px;

  /* stylelint-disable */
  &:-internal-autofill-selected,
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    /* Disable background color of input autocomplete */
    box-shadow: 0 0 0 100px #fff inset !important;
    font-size: initial !important;
  }
  /* stylelint-enable */

  &[type='number'] {
    -moz-appearance: textfield;
  }
  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: #adadad;
  }
}
</style>
