<template>
  <Sender />
</template>

<script setup lang="ts">
import Sender from './components/Sender.vue'
</script>

<style lang="postcss">
@import './css/font.postcss';
@import './css/global.postcss';

html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background: $bg-dark;
  color: white;
  * {
    box-sizing: border-box;
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s linear;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

a {
  color: $blue;
  text-decoration: none;
}

@media (max-width: 568px) {
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
