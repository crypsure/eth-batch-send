<template>
  <footer>
    <div v-if="chainData?.explorer" class="contract">
      <a
        target="_blank"
        :href="`${chainData.explorer}/address/${chainData.batchSendContract}`"
      >
        Contract
      </a>
    </div>
    <div class="copyright">
      © 2024 <a target="_blank" href="https://crypsure.app">Crypsure</a>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { chainData } from '../utils'
</script>

<style lang="postcss" scoped>
@import '../css/global.postcss';

footer {
  @mixin text-medium 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 96px;
  padding-bottom: 16px;
  width: 100%;
  max-width: 480px;
}
.copyright {
  margin-left: auto;
}
</style>
