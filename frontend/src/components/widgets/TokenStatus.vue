<template>
  <div class="token-status" v-if="batchOptions.token">
    <div class="name">
      Name:
      <span>{{ `${batchOptions.token.name} (${batchOptions.token.symbol})` }}</span>
    </div>
    <div class="balance">
      Balance: <span>{{ balance }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { batchOptions } from '../../utils'

const balance = computed(() => {
  const { token } = batchOptions.value
  if (token) {
    const balance = parseInt(token.balance) / Math.pow(10, parseInt(token.decimals))
    return balance.toLocaleString()
  }
})
</script>

<style lang="postcss" scoped>
@import '../../css/global.postcss';

.token-status {
  @mixin title-regular 15px;
  display: flex;
  margin-top: 12px;
  span {
    font-weight: 700;
  }
}
.balance {
  margin-left: 16px;
}
</style>
