<template>
  <div class="checkbox" @click="handleCheck($event, !checked)">
    <input type="checkbox" :value="label" :checked="checked" :modelValue="checked" />
    <span class="checkmark" :class="checkedClass" />
    <span v-if="label" class="checkbox-text" v-html="label" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const { label } = defineProps<{
  label?: string
}>()
const checked = defineModel<boolean>()
const checkedClass = computed(() => {
  return checked.value ? 'checked' : ''
})

const handleCheck = (event: MouseEvent, check: boolean) => {
  if (event.target) {
    const el = event.target as Element
    if (el.nodeName !== 'A') {
      checked.value = check
    }
  }
}
</script>

<style lang="postcss" scoped>
@import '../../css/global.postcss';

.checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin: 8px 16px 16px 0;
}

input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-text {
  @mixin text-medium 13px;
  padding-top: 2px;
  text-align: left;
}

.checkmark {
  height: 16px;
  width: 16px;
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid grey;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin-right: 8px;

  &.checked {
    background-color: $blue;
    border: 1px solid transparent;

    &::after {
      content: '';
      display: block;
      width: 3px;
      height: 6px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      transform: translate(0, -1px) rotate(45deg);
    }
  }
}
</style>
