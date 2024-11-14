<template>
  <div ref="wrapper" class="spin">
    <span class="dot" />
    <span class="dot" />
    <span class="dot" />
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ size?: number }>(), { size: 10 })
</script>

<style lang="postcss" scoped>
.spin {
  display: inline-flex;
  align-items: center;
}
.dot {
  width: v-bind(size + 'px');
  height: v-bind((size * 0.7) + 'px');
  background-color: black;
  animation: scale 0.6s ease alternate infinite;
  &:not(:first-child) {
    margin-left: calc(v-bind(size + 'px') * 0.6);
  }
  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }
  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }
}
@keyframes scale {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
