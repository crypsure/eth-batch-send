<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32">
    <!-- eslint-disable max-len -->
    <path
      :fill="color"
      d="M16 2A14.172 14.172 0 0 0 2 16a14.172 14.172 0 0 0 14 14a14.172 14.172 0 0 0 14-14A14.172 14.172 0 0 0 16 2Zm8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z"
    />
    <path :fill="plusColor" d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7v2z" />
    <!-- eslint-enable max-len -->
  </svg>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    color?: string
    plusColor?: string
  }>(),
  {
    color: '#525252',
    plusColor: 'white',
  },
)
</script>
