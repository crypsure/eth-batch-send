<template>
  <button :class="['button', disabled && 'disabled']" :disabled="disabled" @click="click">
    <div v-if="animate" class="btn-animate">
      <Spinner class="btn-spinner" />
    </div>
    <div v-else class="button-text">
      <span>
        {{ text }}
      </span>
      <slot />
    </div>
    <div v-if="animate" class="hidden-text">
      {{ text }}
    </div>
  </button>
</template>

<script lang="ts" setup>
import Spinner from './Spinner.vue'

const emit = defineEmits(['click'])

const {
  disabled = false,
  animate = false,
  text = '',
} = defineProps<{
  text?: string
  disabled?: boolean
  animate?: boolean
}>()

const click = (e: Event) => {
  if (!disabled) {
    emit('click', e)
  }
}
</script>

<style lang="postcss">
.hidden-text {
  visibility: hidden;
}

button {
  position: relative;
}

.btn-animate {
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
