<template>
  <div class="connect-wrap" :class="{ connected: !!wallet }">
    <div class="wallet network">
      <svg
        height="14"
        viewBox="0 0 24 24"
        width="14"
        xmlns="http://www.w3.org/2000/svg"
        class="eth-icon"
      >
        <path
          d="m11.944 17.97-7.364-4.35 7.363 10.38 7.37-10.38-7.372 4.35zm.112-17.97-7.366 12.223 7.365 4.354 7.365-4.35z"
        />
      </svg>
      <div>{{ chainData?.name ?? 'Unknown' }}</div>
    </div>
    <div v-if="wallet" class="wallet account">
      <div class="account-eth">
        {{ ethDisplay }}
      </div>
      <div class="account-address">
        {{ addressDisplay }}
      </div>
    </div>
    <div v-else class="wallet connect" @click="connect">Connect Wallet</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IWallet } from '../../types'
import { chainData } from '../../utils'

const { wallet } = defineProps<{
  wallet: IWallet | undefined
}>()

const emit = defineEmits<{
  (e: 'connect'): void
}>()

const addressDisplay = computed(() => {
  const addr = wallet?.address
  if (addr) {
    return `${addr.slice(0, 6)}...${addr.slice(addr.length - 4, addr.length)}`
  }
  return ''
})

const ethDisplay = computed(() => {
  const eth = wallet?.eth
  let display = '?'
  if (eth) {
    const parts = eth.split('.')
    if (parts.length === 1) {
      display = parts[0]
    } else {
      display = `${parts[0]}.${parts[1].slice(0, 4)}`
    }
  }
  return `${display} ETH`
})

const connect = () => {
  emit('connect')
}
</script>

<style lang="postcss">
@import '../../css/global.postcss';

.connect-wrap {
  display: flex;
  font-size: 14px;
}

.wallet {
  display: flex;
  align-items: center;
  border: 1px solid $orange;
  color: $orange;
  height: 34px;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: black;
  user-select: none;
}
.connect {
  padding: 6px 12px;
  cursor: pointer;
  &:hover {
    background-color: rgba($orange, 0.1);
  }
}
.account {
  cursor: pointer;
}
.network {
  margin-right: 16px;
  padding: 0 12px;
}

.eth-icon {
  fill: $orange;
  margin: 1px 8px 0 0;
}
.account-eth {
  padding: 0 8px 0 12px;
}
.account-address {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px 0 6px;
  background-color: rgba($blue, 0.25);
}
.connect-wrap.connected {
  .wallet {
    border-color: $blue;
    color: $blue;
  }
  .account:hover {
    background-color: rgba($blue, 0.1);
  }

  .eth-icon {
    fill: $blue;
  }
}
</style>
